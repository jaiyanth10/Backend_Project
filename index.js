import dotenv from "dotenv"; //using dotenv lib for more protection of env variables
import { connectDB } from "./db/index.js";
dotenv.config({ path: "./env" }); //configuring dotenv
connectDB();
