import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import mongoDB from "./src/db/index.js";
import logger from "./src/utils/logger.js";

const app = express();
const httpServer = createServer(app);

// Socket.IO Setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

// Make io accessible in routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Socket.IO Authentication & Connection Handler
import jwt from 'jsonwebtoken';
import { User } from './src/models/user.model.js';

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.userEmail = user.email;
    
    logger.info({ userId: socket.userId }, 'Socket authenticated');
    next();
  } catch (error) {
    logger.error({ error: error.message }, 'Socket authentication failed');
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  logger.info({ 
    userId: socket.userId, 
    socketId: socket.id 
  }, 'Client connected');

  // Join user's personal room
  socket.join(`user:${socket.userId}`);

  // Handle disconnect
  socket.on('disconnect', () => {
    logger.info({ 
      userId: socket.userId, 
      socketId: socket.id 
    }, 'Client disconnected');
  });

  // Optional: Handle manual refresh request
  socket.on('request:refresh', () => {
    socket.emit('notes:refresh');
  });
});

// Start Server
mongoDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info('Socket.IO enabled for real-time sync');
    });
  })
  .catch((err) => {
    logger.error("DB connection failed", err);
    console.log("Error while connecting to DB", err);
  });

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is healthy",
    socketIO: "enabled"
  });
});

// Routes
import authRoutes from "./src/routes/auth.route.js";
import noteRoutes from "./src/routes/note.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/profile", profileRoutes);

app.use(errorHandler);

export { app, io };