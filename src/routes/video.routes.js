import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getAllVideos);

router.route("/").post(
  //multer function injection
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  publishAVideo
);

router.route("/:videoId").get(getVideoById);

router.route("/:videoId").patch(upload.single("thumbnail"), updateVideo); //patch will update only particular field.

router.route("/:videoId").delete(deleteVideo); //delete will delete the data

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
