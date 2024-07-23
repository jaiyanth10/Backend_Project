// While writing models first design them in website like draw.io or browse for other wesite for data modelling.
// Data model for this project :https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj
// If you are in confusion about, for which field you need to put reqired, think like this,
//for most of  fields you are taking for user, u need required
// If you are confused, refer User and video models, they have explanations in commnents
import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //one who is subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, //one to whom subscriber is subscribing
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = new mongoose.model(
  "subscription",
  subscriptionSchema
);
