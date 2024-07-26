import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { tweet } = req.body;

  if (!tweet) {
    throw new ApiError(404, "tweet not found");
  }
  const created_tweet = Tweet.create({
    owner: req.user._id,
    content: tweet,
  });
  if (!created_tweet) {
    throw new ApiError(500, "tweet is not created");
  }
  return res.status(200).json(new ApiResponse(200, tweet, "tweet is created!"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  let tweets = [];
  //.find will return array of doccuments satisfing the query
  const userId1 = new mongoose.Types.ObjectId(userId);
  const matched_documents = await Tweet.find({ owner: userId1 }).select(
    "content"
  );
  if (!matched_documents) {
    throw new ApiError(404, "no documents found for this userId");
  }
  matched_documents.forEach((document) => tweets.push(document.content));
  return res.status(200).json(new ApiResponse(200, tweets, "all tweets fetched!"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const {tweetId} = req.params;
  const {newtweet} = req.body;
  await Tweet.findByIdAndUpdate(tweetId,{$set:{content:newtweet}},{new:true})
  return res.status(200).json(new ApiResponse(200,"tweet updated!"))
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const {tweetId} = req.params;
  await Tweet.findByIdAndDelete(tweetId)//findByIdAndDelete will delete the entire document using the passed ID
  return res.status(200).json(new ApiResponse(200,"tweet deleted!"))
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
