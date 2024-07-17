import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing video ID");
  }

  const like = await Like.findOne({ video: videoId, likedBy: req.user._id });

  if (!like) {
    await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });
  } else {
    await Like.findByIdAndDelete(like._id);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video like has toggled"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid or missing comment ID");
  }

  const like = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (!like) {
    await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
  } else {
    await Like.findByIdAndDelete(like._id);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment like toggled successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid or missing tweet ID");
  }

  const like = await Like.findOne({ tweet: tweetId, likedBy: req.user._id });

  if (!like) {
    await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
    });
  } else {
    await Like.findByIdAndDelete(like._id);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet like toggled successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $project: {
        video: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
