import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

//creating routes (end points)
router.route("/register").post(
  //injecting multer middlewareby importing custom function called "upload" from multer middleware file.
  //.fields will create field for every object in that array.
  upload.fields([
    { name: "avatar", maxCount: 1 },//maxcount will limit no of files to upload
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser //function controller which returns response to frontend
);

export { router };
