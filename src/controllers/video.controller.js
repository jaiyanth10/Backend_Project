import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const pipeline = [{}, {}, {}];
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  //get local paths using .files
  const videoFile_localPath = req.files.videoFile[0].path;
  if (!videoFile_localPath) {
    throw new ApiError(400, "video files is required to publish");
  }
  const thumbnail_localPath = req.files.thumbnail[0].path;
  if (!thumbnail_localPath) {
    throw new ApiError(400, "video files is required to publish");
  }
  //upload to cloudinary
  const video_cloudinary = await uploadOnCloudinary(videoFile_localPath);
  const thumbnail_cloudinary = await uploadOnCloudinary(thumbnail_localPath);

  console.log(video_cloudinary);
  console.log(thumbnail_cloudinary);

  const video = await Video.create({
    videoFile: video_cloudinary.url,
    thumbnail: thumbnail_cloudinary.url,
    title: title,
    description: description,
    duration: video_cloudinary.duration,
    owner: req.user._id,
  });

  const createdVideo = await Video.findById(video._id);
  console.log("cv", createdVideo);
  if (!createdVideo) {
    throw new ApiError(500, "video is not created/published");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdVideo, "video is published"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  const video_url = video.videoFile;
  return res
    .status(200)
    .json(new ApiResponse(200, video_url, "video URL fetching successful"));
});

// special case : using both req.params and req.body for this endpoint
// version 1:
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const newthumbnailLocalPath = req.file.path; //as this is single file .file will work
  const cloudinary_thumbnail = await uploadOnCloudinary(newthumbnailLocalPath);
  //TODO: update video details like title, description, thumbnail
  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: cloudinary_thumbnail.url,
      },
    },
    {
      new: true, // WKT, findByIdandUpdate will return the documnet instance of passed id, by using new :true, the updated and recent instance will be returned.
    }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "title, description, thumbnail updated!")
    );
});
//version 2:
// const updateVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;
//     const { title, description } = req.body;
//     const newthumbnailLocalPath = req.file.path;
//     const cloudinary_thumbnail = await uploadOnCloudinary(newthumbnailLocalPath);

//     // Find and update video details
//     const video = await Video.findById(videoId);
//     if (!video) {
//       throw new ApiError(404, "Video not found");
//     }

//     video.title = title;
//     video.description = description;
//     video.thumbnail = cloudinary_thumbnail.url;

//     await video.save({ validateBeforeSave: false });

//     return res.status(200).json(new ApiResponse(200, video, "Title, description, and thumbnail updated!"));
//   });

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  //User.findByIdAndDelete will find and delete the doc in mongo db
  const result = await Video.findByIdAndDelete(videoId);
  if (!result) {
    throw new ApiError(500, "cant delete the video(document)");
  }
  res.status(200).json(new ApiResponse(200, "video(document) deleted"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if(!video){
    throw new ApiError(404,"video not found");
  }
  const current_isPublished = video.isPublished;
  video.isPublished = !current_isPublished;
  await video.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, video.isPublished, "isPublished is toggled"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
