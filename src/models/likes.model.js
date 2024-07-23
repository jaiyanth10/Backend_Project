// While writing models first design them in website like draw.io or browse for other wesite for data modelling.
// Data model for this project :https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj
// If you are in confusion about, for which field you need to put reqired, think like this,
//for most of  fields you are taking for user, u need required
// If you are confused, refer User and video models, they have explanations in commnents
import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
