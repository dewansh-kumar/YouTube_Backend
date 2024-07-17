import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();

router
  .route("/toggleSubscription/:channelId")
  .post(verifyJWT, toggleSubscription);

router
  .route("/getUserChannelSubscribers/:channelId")
  .get(verifyJWT, getUserChannelSubscribers);

router
  .route("/getSubscribedChannels/:subscriberId")
  .get(verifyJWT, getSubscribedChannels);

export default router;
