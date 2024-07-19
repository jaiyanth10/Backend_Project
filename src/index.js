import dotenv from "dotenv"; //using dotenv lib for more protection of env variables
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
dotenv.config({ path: "./.env" }); //configuring dotenv
//call database connection function,if successfull connect to server
connectDB()
  .then(() => {
    // server connection part 1 - 1st listen to errors on app
    app.on('error',(err)=>console.log("Error in app",err));
    // server connection part 2 - 2nd listen to port on app
    const port = process.env.PORT || 8000;//default port
    return app.listen(port, () => 
        console.log(`port is running on ${port}`));
  })
  .catch((err) => console.log("error connecting to database", err));
