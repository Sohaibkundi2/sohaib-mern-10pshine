import { Note } from "../models/note.model.js";
import ApiError from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponce.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) throw new ApiError(400, "Title and content are required");

  const note = await Note.create({
    owner: req.user._id,
    title,
    content,
  });

  logger.info({ noteId: note._id, userId: req.user._id }, "Note created");

  res.status(201).json(new ApiResponse(201, note, "Note created successfully"));
});

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ owner: req.user._id }).sort({ createdAt: -1 });

  logger.info({ count: notes.length, userId: req.user._id }, "Fetched all notes");

  res.status(200).json(new ApiResponse(200, notes, "Notes fetched successfully"));
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

  res.status(200).json(new ApiResponse(200, note, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!note) throw new ApiError(404, "Note not found or not authorized");

  logger.warn({ noteId: req.params.id }, "Deleted note");

  res.status(200).json(new ApiResponse(200, null, "Note deleted successfully"));
});

export { createNote, getAllNotes, getNoteById, updateNote, deleteNote };
