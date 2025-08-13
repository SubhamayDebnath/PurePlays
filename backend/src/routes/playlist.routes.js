import { Router } from "express";
import {
  getPlaylists,
  getPlaylistsByUsername,
  createPlayList,
  editPlaylist,
  deletePlayList,
  getVideosByPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJwtToken, getPlaylists);
router.get("/user/:username", getPlaylistsByUsername);
router.post("/create", verifyJwtToken, createPlayList);
router.put("/edit/:id", verifyJwtToken, editPlaylist);
router.delete("/delete/:id", verifyJwtToken, deletePlayList);
router.get("/:id", getVideosByPlaylist);
router.post("/add/video", verifyJwtToken, addVideoToPlaylist);
router.delete("/remove/video", verifyJwtToken, removeVideoFromPlaylist);

export default router;
