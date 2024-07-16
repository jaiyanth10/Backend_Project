import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js"
const router = Router();

//creating routes (end points)
router.route("/register").post(registerUser)

export {router}