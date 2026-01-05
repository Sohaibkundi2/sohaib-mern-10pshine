import "dotenv/config";
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";

import cookieParser from "cookie-parser";

import mongoDB from "./src/db/index.js";
import logger from "./src/utils/logger.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());


app.get("/api/test", (req, res) => {
  res.send("API is working");
});
 

const PORT = process.env.PORT || 5000;

mongoDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("DB connection failed", err);
    console.log("Error while connecting to DB", err);
  });

//Test
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Routes
import authRoutes from "./src/routes/auth.route.js";
app.use("/api/auth", authRoutes);
// Error Handling Middleware
app.use(errorHandler);


export { app };
