import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();



cloudinary.config({
  cloud_name: process.env.MY_CLOUD_NAME,
  api_key: process.env.MY_CLOUD_API_KEY,
  api_secret: process.env.MY_CLOUD_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      logger.warn("Cloudinary upload skipped: localFilePath is missing");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    logger.info("Cloudinary upload successful");
    return { ...response, url: response.secure_url };

  } catch (error) {
    logger.error("Cloudinary upload failed", error.message);
    return null;

  } finally {
    // Guaranteed cleanup
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      logger.info("Temporary local file deleted", localFilePath);
    }
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      logger.warn("Cloudinary delete skipped: publicId is missing");
      return null;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    logger.info("Cloudinary delete successful", publicId);
    return result;

  } catch (error) {
    logger.error("Cloudinary delete failed", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
