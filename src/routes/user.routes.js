import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  regenerateAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

//creating routes (end points)

//route for user registartion
router.route("/register").post(
  //injecting multer middlewareby importing custom function called "upload" from multer.middleware.js file.
  //.fields will create field to upload file for every object in that array.
  //this will add a new property called files(req.files) to req simillar to body(req.body).
  //files(req.files) because we are taking more than one file.
  upload.fields([
    { name: "avatar", maxCount: 1 }, //maxcount will limit no of files to upload
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser //function from controller which returns response to frontend
);

//route for user login
router.route("/login").post(loginUser); //loginUser is a function from controller which returns response to frontend

//secure routes
//route for user logout
router.route("/logout").post(
  //injecting auth middleware by importing custom function called "verifyJWT" from auth.middleware.js file.
  //this middleware will help us in logging out, read comments of logoutUser function in user.controller.js and auth.middleware.js
  verifyJWT,
  logoutUser
); //function from controller which returns response to frontend

//route for user to login after session expiry without password
router.route("/regenerateAccessToken").post(regenerateAccessToken); //regenerateAccessToken is function from controller which returns response to frontend

//route for user to change current password
router.route("/changeCurrentPassword").post(
  changeCurrentPassword
); //changeCurrentPassword is function from controller which returns response to frontend

//route for user to get Current User
router.route("/getCurrentUser").post(
  //injecting auth middleware function as using req.users in updateUserCoverImage function in user.controller.js
  verifyJWT,
  getCurrentUser
); //getCurrentUser is function from controller which returns response to frontend

//route for user to update email and password
router.route("/updateAccountDetails").post(
  //injecting auth middleware function as using req.users in updateUserCoverImage function in user.controller.js
  verifyJWT,
  updateAccountDetails
); //updateAccountDetails is function from controller which returns response to frontend

//route for user to update User Avatar
router.route("/updateUserAvatar").post(
  //injecting multer middlewareby importing custom function called "upload" from multer.middleware.js file.
  //.single will create a single field to upload file .
  //injecting auth middleware function as using req.users in updateUserCoverImage function in user.controller.js
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
); //updateUserAvatar is function from controller which returns response to frontend

//route for user to update User cover Image
router.route("/updateUserCoverImage").post(
  //injecting multer middlewareby importing custom function called "upload" from multer.middleware.js file.
  //.single will create a single field to upload file .
  //injecting auth middleware function as using req.users in updateUserCoverImage function in user.controller.js
  verifyJWT,
  upload.single("CoverImage"),
  updateUserCoverImage
); //updateUserCoverImage is function from controller which returns response to frontend

//route for user to get channel profile
//to click this endpoint : the url should be like http://localhost:8000/api/v1/users/getuserProfile/johndoe
//In client side :axios.get(`http://localhost:8000/api/v1/users/getuserProfile/${username}`)
router.route("/getuserProfile/:username").get(
  getUserChannelProfile //getUserChannelProfile is function from controller which returns response to frontend
);

//route for user to get getWatchHistory
//to click this endpoint : the url should be like http://localhost:8000/api/v1/users/getWatchHistory
//In client side :axios.get(`http://localhost:8000/api/v1/users/getWatchHistory`)
router.route("/getWatchHistory").get(
  //injecting auth middleware function as using req.users in getWatchHistory function in user.controller.js
  verifyJWT,
  getWatchHistory //getWatchHistory is function from controller which returns response to frontend
);

export { router };
