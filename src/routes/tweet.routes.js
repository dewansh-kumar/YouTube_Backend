import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

router.route("/createTweet").post(verifyJWT, createTweet);

router.route("/getUserTweets").get(verifyJWT, getUserTweets);

router.route("/updateTweet/:tweetId").post(verifyJWT, updateTweet);

router.route("/deleteTweet/:tweetId").post(verifyJWT, deleteTweet);

export default router;
