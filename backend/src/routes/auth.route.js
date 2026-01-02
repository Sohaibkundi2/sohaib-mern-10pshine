import { Router } from "express";
import { registerUser,
      loginUser,
  generateAccessRefreshToken,
 } from "../controllers/auth.controller.js";
import upload from './../middlewares/multer.middleware.js'

const router = Router();

router.post("/register",(
    upload.single("avatar")
), registerUser);

router.route('/login').post(loginUser)
router.route('/refresh-token').post(generateAccessRefreshToken)

export default router;