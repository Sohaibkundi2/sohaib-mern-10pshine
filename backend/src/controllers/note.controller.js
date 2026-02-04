// src/controllers/note.controller.js
import { Note } from "../models/note.model.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

// Helper function to emit socket events
const emitNoteEvent = (req, event, data) => {
  const io = req.app.get('io');
  if (io) {
    io.to(`user:${req.user._id}`).emit(event, data);
    logger.info({ event, userId: req.user._id }, 'Socket event emitted');
  }
};

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) throw new ApiError(400, "Title and content are required");

  const note = await Note.create({
    owner: req.user._id,
    title,
    content,
  });

  logger.info({ noteId: note._id, userId: req.user._id }, "Note created");

  // Emit socket event for real-time sync
  emitNoteEvent(req, 'note:created', note);

  res.status(201).json(new ApiResponse(201, note, "Note created successfully"));
});

const getAllNotes = asyncHandler(async (req, res) => {
  const { favorite, archived } = req.query;

  const filter = { owner: req.user._id };

  if (favorite === "true") {
    filter.isFavorite = true;
  }

  if (archived === "true") {
    filter.isArchived = true;
  } else if (archived === "false") {
    filter.isArchived = false;
  }

  const notes = await Note.find(filter).sort({ createdAt: -1 });

  logger.info(
    { count: notes.length, userId: req.user._id },
    "Fetched notes"
  );

  res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
  if (!note) throw new ApiError(404, "Note not found");

  logger.info({ noteId: req.params.id }, "Fetched note");

  res.status(200).json(new ApiResponse(200, note, "Note fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { title, content },
    { new: true }
  );

  if (!note) throw new ApiError(404, "Note not found or not authorized");

  logger.info({ noteId: req.params.id }, "Updated note");

  // Emit socket event for real-time sync
  emitNoteEvent(req, 'note:updated', note);

  res.status(200).json(new ApiResponse(200, note, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!note) throw new ApiError(404, "Note not found or not authorized");

  logger.warn({ noteId: req.params.id }, "Deleted note");

  // Emit socket event for real-time sync
  emitNoteEvent(req, 'note:deleted', { _id: req.params.id });

  res.status(200).json(new ApiResponse(200, null, "Note deleted successfully"));
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    owner: req.user._id
  });

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  // Toggle the favorite status
  note.isFavorite = !note.isFavorite;
  await note.save();

  logger.info({ 
    noteId: note._id, 
    userId: req.user._id,
    isFavorite: note.isFavorite 
  }, 'Note favorite toggled');

  // Emit socket event for real-time sync
  emitNoteEvent(req, 'note:updated', note);

  res.status(200).json(
    new ApiResponse(200, note, `Note ${note.isFavorite ? 'added to' : 'removed from'} favorites`)
  );
});

const toggleArchive = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findOne({
    _id: id,
    owner: req.user._id,
  });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  note.isArchived = !note.isArchived;
  await note.save();

  logger.info(
    { noteId: id, isArchived: note.isArchived },
    "Toggled note archive status"
  );

  // Emit socket event for real-time sync
  emitNoteEvent(req, 'note:updated', note);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        note,
        note.isArchived ? "Note archived" : "Note restored"
      )
    );
});

// NEW: Search notes
const searchNotes = asyncHandler(async (req, res) => {
  const { q, favorite, archived } = req.query;

  if (!q || q.trim().length === 0) {
    throw new ApiError(400, "Search query is required");
  }

  const searchQuery = q.trim();

  // Build filter
  const filter = {
    owner: req.user._id,
    $or: [
      { title: { $regex: searchQuery, $options: 'i' } },
      { content: { $regex: searchQuery, $options: 'i' } }
    ]
  };

  // Apply additional filters
  if (favorite === "true") {
    filter.isFavorite = true;
  }

  if (archived === "true") {
    filter.isArchived = true;
  } else if (archived === "false") {
    filter.isArchived = false;
  }

  const notes = await Note.find(filter).sort({ createdAt: -1 });

  logger.info(
    { 
      query: searchQuery, 
      count: notes.length, 
      userId: req.user._id 
    },
    "Search notes"
  );

  res.status(200).json(
    new ApiResponse(
      200, 
      notes, 
      notes.length > 0 
        ? `Found ${notes.length} note(s)` 
        : "No notes found"
    )
  );
});

export { 
  createNote, 
  getAllNotes, 
  getNoteById, 
  updateNote, 
  deleteNote, 
  toggleFavorite, 
  toggleArchive,
  searchNotes 
};