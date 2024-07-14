import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"; //use for jwt tokens
import bcrypt from "bcrypt"; //used for hashing the password and stuff
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //use this for efficent seraching- good practise
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true, //use this for efficent seraching- good practise
    },
    avatar: {
      type: String, //cloudinary URL
      required: true,
    },
    coverImage: {
      type: String, //cloudinary URL
    },
    watchHistory: {
      type: Schema.Types.ObjectId, //The ObjectId type is often used to create relationships between different documents in MongoDB collections.(different data models)
      ref: "Video", //Indicates that the ObjectId references the Video model(another model).
    },
    password: {
      type: String,
      required: [true, "Password is Required"], //default warning msh
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // by making the timestamps true, u will Createdat and Updatedat
  }
);
//Encryption of password before saving into DB.
//Read point 4 in video 8 in google docs.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});
//Now I am creating a custom method for this schema to check if password is matching.
//Read point 5 in video 8 in google docs.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //returns boolean
};
//creating JWT(type) Access token Tokens with custom methods.
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      //payload
      _id: this._id, //_id is id from mongo dd//this.vales are from DB.
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    //secret
    process.env.ACCESS_TOKEN_SECRET,
    {
      //expiry
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
//creating JWT(type) Refresh token Tokens with custom methods.
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
//exporting model
export const User = mongoose.model("User", userSchema);
