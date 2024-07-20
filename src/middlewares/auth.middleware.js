// This is custom(created by us) middleware will add a new property or field to req called user(req.user) similar to req.body, req.files.
//If u remember for files upload also multer middleware injection in routes gave us req.files propert.
//CookieParser gave req.cookie and res.cookie.

// For logout functionality or endpoint in user.controller.js we need the id of current user to clear refresh token in user document.
//for that we will inject this custom  middle ware for the route of logout endpoint, so that it will save fetch data from cookie and make it avaliable in res.user

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//_ in below line, basically as we are not using res, here we used _ in place of it.(so called proffesional approach - no affect on code)
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    //step1
    //fetching the token from cookie(which we sent using res.cookie while euser loged in), req.header is approach mobile app, so .cookies fail we are also checking that condition.
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    //jwt.verify is inbuilt method of jwt, which will if the token user has  is correct one or not using the secret key we have in server.
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //removing not needed fields for security purposes
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    //Adding new field user to req, which has instance of the current logged in user.
    //in JS if the object dont have a property, you can by doing like below.
    req.user = user;
    next(); // this will pass control to next middleware, as work is done here.
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
    
  }
});
