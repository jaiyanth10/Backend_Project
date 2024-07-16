//Remeber the controllers are like bridge between the model and view, It wont contain any logic it will only instruct the model and view.

import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler((req, res) => {
  res.status(200).json({ message: "ok" });
  // u can also write seperatelt, but above is called method chain a good practise., res.status(200); res.json({ message: "ok" });
  //send json and set statues 200. read google doc for more clarity on this line of code.
}); 
export {registerUser};