import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
//fs is library of file system which comes bydefault with node js.
//fs is used to manipulate files like read,write and etc.

// Configuration of cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//we are writing this method to upload the file in cloudinary.
//for that we are passing localpath of file in server(node js) to this method.
async function uploadOnCloudinary(localFilePath) {
  try {
    if (!localFilePath) {
      return null; //return null if path is not crt.
    }
    //proceed if crt
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("file uploaded to cloudinary",response.url);
    fs.unlinkSync(localFilePath); //this will remove file from localpath as it failing in uploading to cloudinary
    return response;
  } catch (err) {
    // if there is any error in uploading to cloudianry,for security purposes, delete the temporarly saved local file.
    fs.unlinkSync(localFilePath); //this will remove file from localpath as it failing in uploading to cloudinary
    return null;
  }
}

async function deleteFileOnCloudinary(path) {
  try {
    if (!path) {
      return null; //return null if path is not crt.
    }
    //uploade.destry will delete single file in cloudinary.
    //It take 2 parameters 1.name of file in cloudinary, callback function console.log(result), result will be automatically provided.
    // Lets extract the name from path to pass as first parameter
    const parts = path.split("/"); // parts = ["https:", "", "res.cloudinary.com", "demo", "image", "upload", "v1625253607", "sample.jpg"]
    const filename = parts.pop(); // pops the last element(think structure as stack) filename = "sample.jpg"
    const nameParts = filename.split("."); // nameParts = ["sample", "jpg"]
    const name = nameParts[0]; // name = "sample"
    await cloudinary.uploader.destroy(name, (result) => console.log(result));
  } catch (err) {
    console.log("Unable to delete file from cloudinary", err);
  }
}

export { uploadOnCloudinary, deleteFileOnCloudinary };
