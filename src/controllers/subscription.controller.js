import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  if (!isValidObjectId(channelId)) {
    console.log(channelId);
    throw new ApiError(400, "Invalid channel id");
  }

  const channel = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (channel) {
    await Subscription.deleteOne({
      $and: [{ subscriber: req.user?._id }, { channel: channelId }],
    });
  } else {
    await Subscription.create({
      subscriber: req.user?._id,
      channel: channelId,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subscription  is toggled successfully"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        subscriberDetails: 1,
      },
    },
  ]);

  if (subscribers?.length == 0) {
    throw new ApiError(404, "Subscriber does not exists");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscriber details fetched"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // console.log(subscriberId)

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber id");
  }

  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        channelDetails: 1,
      },
    },
  ]);

  if (channels?.length == 0) {
    throw new ApiError(
      404,
      "Subscribed channel does not exist for the give subscribed id"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channels, "channel details fetched successfully")
    );
});

export { getSubscribedChannels, toggleSubscription, getUserChannelSubscribers };
