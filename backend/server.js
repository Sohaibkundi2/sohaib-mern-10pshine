import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import mongoDB from "./src/db/index.js";
import logger from "./src/utils/logger.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./src/routes/auth.route.js";
import noteRoutes from "./src/routes/note.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";

import jwt from "jsonwebtoken";
import { User } from "./src/models/user.model.js";

const app = express();
const isTestEnv = process.env.NODE_ENV === "test";

let httpServer;
let io;

/* -------------------- Middleware -------------------- */

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

/* -------------------- Routes -------------------- */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/profile", profileRoutes);

app.use(errorHandler);

/* -------------------- Socket.IO (ONLY prod/dev) -------------------- */

if (!isTestEnv) {
  httpServer = createServer(app);

  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  app.set("io", io);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded._id);

      if (!user) return next(new Error("User not found"));

      socket.userId = user._id.toString();
      next();
    } catch (err) {
      logger.error({ err: err.message }, "Socket auth failed");
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);
  });
}

/* -------------------- Start Server -------------------- */

if (!isTestEnv) {
  const PORT = process.env.PORT || 5000;

  mongoDB()
    .then(() => {
      httpServer.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      logger.error({ err }, "DB connection failed");
    });
}

export { app };