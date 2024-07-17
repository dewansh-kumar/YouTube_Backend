import express, { request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// humlog app.use() middleware ke liye use karte h

/* cors ke user 'cross origin' problem ko solve karne ke liye karte h, i,e request server pe jane se pahle 
 hum us request ko check karte h ki wo valid h ya nhi like portno. check karna isse hum middleware kahte h */

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// agar hum data json formate me lete h to limit kya honi chahiye
app.use(express.json({ limit: "16kb" }));

// agar data url  se le rahe h to wo encoded ho kar ata h
app.use(express.urlencoded({extended: true, limit: "16kb"}))

// agar koi file upload karte h to ise use karte h
app.use(express.static("public"))

/* cookie-parser ka user server se kisi bhi user ke browser ki cookie
 me securely CRUD operation perform kane ke liye kiya jata h */
 app.use(cookieParser())


 // import routers

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import likeRouter from "./routes/like.router.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import playlistRouter from "./routes/playlist.routes.js"


// routes declaration 

// redirect to the userRouter file
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register

app.use("/api/v1/video", videoRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/playlist", playlistRouter)

export { app };
