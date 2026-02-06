import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);

    if (process.env.NODE_ENV !== "test") {
      logger.info(
        { host: connectionInstance.connection.host },
        "MongoDB connected successfully"
      );
    }

    return connectionInstance;
  } catch (error) {
    logger.error(
      { message: error.message, stack: error.stack },
      "MongoDB connection failed"
    );

    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }

    throw error;
  }
};

export default connectDB;
