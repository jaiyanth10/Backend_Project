// The app file deals with configurations and routes

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express(); // ctreating reference of express function and exporting
//app.use is used for configuaring and middle ware
//body parser is a middle ware, in this express version body-parser is included

//configuring cors, and configuring the body parsing of recieved client data.:
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true })); //configuring cors
//body parser parses incoming request bodies and makes the data available in req.body
app.use(express.json({ limit: "16kb" })); //configuring body-parsing for json data with limit to avoid server crash
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //body-parsing for URL encoding,(for +%20 etc)

app.use(express.static("public")); //configuring a folder for storing recieved files in server

//cookie-parser is used to do crud operations in users browser cookies
app.use(cookieParser());

//routes import
import { router as userRouter } from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter); // this line will make this indirectly http://localhost:8000/api/v1/users/register
