import { Router } from "express";
import { registerUser,
      loginUser,
  generateAccessRefreshToken,
    logoutUser
 } from "../controllers/auth.controller.js";
import upload from './../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.post("/register",(
    upload.single("avatar")
), registerUser);

router.route('/login').post(loginUser)
router.route('/refresh-token').post(generateAccessRefreshToken)
router.route('/logout').post(verifyJWT,logoutUser)


export default router;