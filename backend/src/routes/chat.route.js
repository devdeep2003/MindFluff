import Router from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getChatToken } from "../controllers/chat.controller.js";

const router = Router();

//before chat , token needs to be generated to create a secure chat session
router.get("/token" , authMiddleware , getChatToken)


//export router
export default router;
