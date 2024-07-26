import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  // case 1: if channelid is found in docs, it means channel exist, so toggle it, means unsubscribe means delete subscription document for this channel id
  // case 2: if channelid is not found in docs, it means channel dont exist, so toggle it, means subscribe means create subscription document for this channel id
  //lets check if the channel exist:
  //As channel is a property of subscription doc, we will use findOne
  //findOne will return the 1st found document. find vs findOne - findOne will return single document,find will return multiple document
  const channel_exist = await Subscription.findOne({ channel: channelId });
  if (!channel_exist) {
    const created_channel = await Subscription.create({
      subscriber: new mongoose.Types.ObjectId(req.user._id),
      channel: channelId,
    });
    if (!created_channel) {
      throw new ApiError(500, "unable to create channel");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, created_channel, "channel created"));
  } else {
    await Subscription.findByIdAndDelete(channel_exist._id);
    return res.status(200).json(new ApiResponse(200, "channel deleted"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const allChannels = await Subscription.find({
    channel: channelId,
  }); //find will return all document with this channelid in their channel property
  let subscriberList = await allChannels.map((doc) => {
    return doc.subscriber;
  }); //map will automatically return new array with updated values
  return res
    .status(200)
    .json(new ApiResponse(200, subscriberList, "subscriber List is fetched!"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const allSubscribers = await Subscription.find({
    subscriber: subscriberId,
  }); //find will return all document with this subscriberId in their subscriber property
  let channelList = await allSubscribers.map((doc) => {
    console.log(doc.channel);
    return doc.channel;
  }); //map will automatically return new array with updated values
  return res
    .status(200)
    .json(new ApiResponse(200, channelList, "channel List is fetched!"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
