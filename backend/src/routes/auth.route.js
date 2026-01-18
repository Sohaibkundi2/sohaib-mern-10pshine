import { Router } from "express";
import { 
  registerUser,
  loginUser,
  generateAccessRefreshToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyResetToken
} from "../controllers/auth.controller.js";
import upload from './../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

// Existing routes
router.post("/register", upload.single("avatar"), registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', generateAccessRefreshToken);
router.post('/logout', verifyJWT, logoutUser);

// NEW: Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken); // Optional

export default router;