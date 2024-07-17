import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/createPlaylist").post(verifyJWT, createPlaylist);

router.route("/getUserPlaylists/:userId").get(verifyJWT, getUserPlaylists);

router.route("/getPlaylistById/:playlistId").get(verifyJWT, getPlaylistById);

router
  .route("/addVideoToPlaylist/:playlistId/:videoId")
  .post(verifyJWT, addVideoToPlaylist);

router
  .route("/removeVideoFromPlaylist/:playlistId/:videoId")
  .post(verifyJWT, removeVideoFromPlaylist);

router.route("/deletePlaylist/:playlistId").post(verifyJWT, deletePlaylist);

router.route("/updatePlaylist/:playlistId").post(verifyJWT, updatePlaylist);

export default router;
