import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export async function connectDB() {
  try {
    const MDB_URL = `${process.env.MONGODB_URI}/${DB_NAME}`;
    console.log(MDB_URL);

    const connectionInstance = await mongoose.connect(MDB_URL);
    console.log(
      `DB connected! Host Name : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Error", error);
    process.exit(1);
    //process.exit() method in Node.js is used to end the running process
    //code of 1, indicating that the process terminated due to an error or some failure.
  }
}
