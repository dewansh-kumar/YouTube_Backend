import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const totalVideo = await Video.countDocuments({ owner: req.user._id });

  const totalVideoViews = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $group: {
        id: null,
        viewCount: { $sum: "$views" },
      },
    },
    {
      $project: {
        viewCount: 1,
      },
    },
  ]);

  totalVideoViews =
    totalVideoViews.length == 0 ? 0 : totalVideoViews[0].viewCount;

  const totalSubscribers = await Subscription.countDocuments({
    channel: req.user._id,
  });

  const totalLikes = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },

    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        likes: {
          $size: "$likes",
        },
      },
    },
    {
      $group: {
        _id: null,
        likesCount: { $sum: "$likes" },
      },
    },
    {
      $project: {
        likesCount: 1,
      },
    },
  ]);

  totalLikes = totalLikes.length == 0 ? 0 : totalLikes[0].likesCount;

  const channelStats = {
    totalVideo,
    totalVideoViews,
    totalSubscribers,
    totalLikes,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, channelStats, "Channel stats fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const videos = await Video.find({ owner: req.user._id });

  if (videos.length == 0) {
    throw new ApiError(404, "Videos not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
