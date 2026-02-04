// src/routes/note.routes.js
import { Router } from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  toggleFavorite,
  toggleArchive,
  searchNotes,
} from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Search route (must come before /:id route to avoid conflicts)
router.get("/search", searchNotes);

// CRUD routes
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

// Toggle routes
router.patch("/:id/favorite", toggleFavorite);
router.patch("/:id/archive", toggleArchive);

export default router;