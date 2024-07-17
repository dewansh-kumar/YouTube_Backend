import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

/* dotenv to 'import' karke configure karte h to .env file load nhi hota h isliye hum jab server run karte h tabhi 
 ek .env file ko load kar lete h experimental variable set karke agar hum 'require' karte h to phir kuchh nhi 
karna parta h
*/

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("Error", (error) => {
      console.log("Server is not connected ", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`Server is listening at port ${port}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed: ", error);
  });

/*
import express from "express";

const app = express()
;(async () =>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("Error", (error) => {
            console.log("ERROR: ", error)
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }catch(error){
        console.log("ERROR: ", error)
    }
})()
*/
