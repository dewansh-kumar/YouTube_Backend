import { Router } from "express";
import {
  deleteVideo,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/uploadVideo").post(
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

router.route("/getVideoById/:videoId").get(verifyJWT, getVideoById);

router
  .route("/updateVideo/:videoId")
  .post(upload.single("thumbnail"), verifyJWT, updateVideo);

router.route("/deleteVideo/:videoId").post(verifyJWT, deleteVideo);

router.route("/togglePublishStatus/:videoId").post(verifyJWT, togglePublishStatus)

export default router;
