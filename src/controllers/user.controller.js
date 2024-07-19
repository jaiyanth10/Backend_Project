//Remeber the controllers are like bridge between the model and view, It wont contain any logic it will only instruct the model and view.
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //Now here I am sending the response to frontend by doing below tasks.
  // understand this for writing logical code
  // 1.get user details from frontend(except images - for images(4.))
  // 2.validation - not empty
  // 3.check if user already exists: username, email
  // 4.check for images, check for avatar using req.files which is available by injecting multer middle ware in user.routes
  // 5.upload them to cloudinary, avatar
  // 6.create user object - create entry in db
  // 7.remove password and refresh token field from response
  // check for succesfull user creation
  //Now, return res

  //1.
  const { fullName, email, username, password } = req.body;
  //2.
  [fullName, email, username, password].forEach((x) => {
    //use forEach for validation and map for creating new array.
    if (x.trim() === "") {
      throw new ApiError(400, "All fields are required"); //using custom ApiError fn from utils to throw error.
    }
  });
  //3.
  const existedUser = await User.findOne({
    //findOne is inbuilt function for User Model from user.model file
    $or: [{ username }, { email }], //$or is ibuilt feature which returns true if one the fields exist.
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  //4.
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //like req.body, req.files will also be available as we injected multer middle ware in route of this end point.
  //check user.routes file.

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  let coverImageLocalPath;
  //checkinng if the cover image is uploaded or not.
  //array.isArray is ibuilt method of Array keyword, which returns T/F if the passed paramter is(has) array or not.
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
  //5.
  const avatar = await uploadOnCloudinary(avatarLocalPath); //uploadOnCloudinary is function from cloudinary.js
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    //checking if uploaded, if no thrwing error by thinking file not uploded by user,
    throw new ApiError(400, "Avatar file is required");
  }
  //6. create a object using User model created using mongoose in user.model file.
  const user = await User.create({
    fullname: fullName, //left side variable name should be same as the one in (user.model.js)mongoose
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email: email,
    password: password,
    username: username.toLowerCase(),
  });
  //7.
  const createdUser = await User.findById(user._id).select(
    //mongo DB will assign _id for every created field, so using it to check if the user is created?
    "-password -refreshToken" // if user is created, then using this syntax with -before the fields to remove those particular fields from object.
  );

  if (!createdUser) {
    //if user is not created in DB throwing error.
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //8.returing res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export { registerUser };
