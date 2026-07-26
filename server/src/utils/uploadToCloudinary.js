import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import upload from "../middlewares/upload.middleware.js";

const uploadToCloudinary = (fileBuffer, folder = "crowdfunding") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default uploadToCloudinary;