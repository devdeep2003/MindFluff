import Router from "express";
import {
  acceptFriendRequest,
  friendrequestController,
  getFriendRequests,
  getFriends,
  getRecommendations,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

//authMiddleware
router.use(authMiddleware);

//get recommendations
router.get("/", getRecommendations);

//get friends
router.get("/myfriends", getFriends);

//send friend request
router.post("/friend-request/:id", friendrequestController);

//accept friend request
router.put("/friend-request/:id/accept", acceptFriendRequest);

//get freind requests
router.get("/friend-requests", getFriendRequests);


//export router
export default router;
