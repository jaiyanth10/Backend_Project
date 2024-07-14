import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";//import the plugin
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
      type: Schema.Types.ObjectId, //The ObjectId type is often used to create relationships between different documents in MongoDB collections.(different data models)
      ref: "User", //Indicates that the ObjectId references the User model(another model).
    },
  },
  {
    timestamps: true,
  }
)
videoSchema.plugin.apply(mongooseAggregatePaginate);// we are applying the installed plugin in to this schema for aggrgartion.
export const Video = mongoose.model("Video", videoSchema);
