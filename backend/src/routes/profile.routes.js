import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  getCurrentUser,
  updateProfile,
  updatePassword,
  updateAvatar,
} from "../controllers/profile.controller.js";
import upload from './../middlewares/multer.middleware.js'

const router = Router();

router.use(verifyJWT);

router.get("/me", getCurrentUser);
router.patch("/update", updateProfile);
router.patch("/password", updatePassword);
router.patch("/avatar", upload.single("avatar"), updateAvatar);

export default router;
