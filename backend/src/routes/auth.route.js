import Router from "express";
import {
  loginController,
  logoutController,
  signupController,
  loggedinProfile
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

//auth routes
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me" , authMiddleware , loggedinProfile)

export default router;
