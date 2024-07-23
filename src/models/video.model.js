// While writing models first design them in website like draw.io or browse for other wesite for data modelling.
// Data model for this project :https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj
// If you are in confusion about, for which field you need to put reqired, think like this,
//for most of  fields you are taking for user, u need required

import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //import the plugin
const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, //cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String, //cloudinary URL
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0, //by default value will be 0
    },
    isPublished: {
      type: Boolean,
      default: true, //by default value will be 0
    },
    video: {
      type: mongoose.Schema.Types.ObjectId, //The ObjectId type is often used to create relationships between different documents in MongoDB collections.(different data models)
      ref: "User", //Indicates that the ObjectId references the User model(another model).
    },
  },
  {
    timestamps: true,
  }
);
// we are applying the installed plugin in to this schema for aggrgartion.
videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);
