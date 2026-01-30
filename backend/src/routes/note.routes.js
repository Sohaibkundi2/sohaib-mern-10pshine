import { Router } from "express";
import { createNote, getAllNotes, getNoteById, updateNote, deleteNote, toggleFavorite, toggleArchive} from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.use(verifyJWT); // protect all note routes

router.post("/", createNote);
router.get("/", getAllNotes);
router.patch('/:id/favorite', toggleFavorite);
router.patch("/:id/archive", toggleArchive);
router.get("/:id", getNoteById);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
