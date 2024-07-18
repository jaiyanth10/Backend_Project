import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

//creating routes (end points)
router.route("/register").post(
    upload.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]),//injecting multer middlewareby importing custom function called "upload" from multer middleware file. 
    registerUser//function controller which returns response to frontend
)


export {router}


