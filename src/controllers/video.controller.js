import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (!title || !description) {
    throw new ApiError(400, "All field required");
  }

  const localVideoFilePath = req.files?.videoFile[0].path;
  const localThumbnailFilePath = req.files?.thumbnail[0].path;

  const videoFile = await uploadOnCloudinary(localVideoFilePath);
  const thumbnail = await uploadOnCloudinary(localThumbnailFilePath);

  if (!videoFile) {
    throw new ApiError(400, "Error while uploading video file");
  }

  if (!thumbnail) {
    throw new ApiError(400, "Error while uploading thumbnail file");
  }

  const video = await Video.create({
    videoFile: videoFile?.url,
    thumbnail: thumbnail?.url,
    title,
    description,
    duration: videoFile?.duration,
    owner: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Object id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;
  const localThumbnailFilePath = req.file?.path;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Object id");
  }

  if (!title || !description) {
    throw new ApiError(400, "Title and Description are required");
  }

  if (!localThumbnailFilePath) {
    throw new ApiError(400, "Thumbnail required");
  }

  const oldVideoDetails = await Video.findById(videoId);
  const thumbnail = await uploadOnCloudinary(localThumbnailFilePath);

  if (!thumbnail) {
    throw new ApiError(400, "Error while uploading thumbnail");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  if (!video) {
    throw new ApiError(400, "Error while updating video details");
  }

  const thumbnailDeletedResponse = await deleteFromCloudinary(
    oldVideoDetails.thumbnail
  );

  if (!thumbnailDeletedResponse) {
    return new ApiError(500, "Failed to delete thumbnail file");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Object id");
  }

  const video = await Video.findByIdAndDelete(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const thumbnailRes = await deleteFromCloudinary(video.thumbnail);
  const videoFileRes = await deleteFromCloudinary(video.videoFile);


  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Object id");
  }

  const video = await Video.findById(videoId);
  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Publish status toggled successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
