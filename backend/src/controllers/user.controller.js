import friendReq from "../models/friendreq.schema.js";
import User from "../models/user.schema.js";

//friend recommendations
export const getRecommendations = async (req, res) => {
  const currentUserid = req.user._id;
  const currentUser = req.user;
  const friendList = currentUser.friends || [];
  try {
    const friends = await User.find({
      $and: [{ _id: { $ne: currentUserid } }, { _id: { $nin: friendList } }],
    }).select("-password -friends -email -__v -createdAt -updatedAt");

    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//friends
export const getFriends = async (req, res) => {
  const currentUserid = req.user._id;
  try {
    const friends = await User.findById(currentUserid)
      .select("friends")
      .populate("friends", "username college profileImage");
    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//request controller
export const friendrequestController = async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;
  try {
    //so there are multiple checks over here to be implemented
    //1. Avoid sending a request to current logged in user , that is to yourself
    //2. throw error if the user is already a friend
    //3. throw error if the user already sent a request

    const friend = await User.findById(id);

    //1. Avoid sending a request to current logged in user , that is to yourself
    if (friend._id.toString() === currentUser._id.toString()) {
      return res.json({
        message: "Request to own : Invalid Request",
      });
    }

    //2. throw error if the user is already a friend
    if (friend.friends.includes(currentUser._id)) {
      return res.json({
        message: "Already a friend : Invalid Request",
      });
    }

    //3. throw error if the user already sent a request
    const friendrequestSend = await friendReq.findOne({
      $or: [
        { sender: currentUser._id, reciever: id },
        { sender: id, reciever: currentUser._id },
      ],
    });
    if (friendrequestSend) {
      return res.json({
        message: "Request already sent : Invalid Request",
      });
    }

    //if the checks are passed , then send the request and log it in RequestLog DB
    const friendrequest = new friendReq({
      sender: currentUser._id,
      reciever: id,
    });

    await friendrequest.save();

    res.json({
      message: "Request sent successfully",
      friendrequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//accept friend request
export const acceptFriendRequest = async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user._id;
  try {
    const request = await friendReq.findOne({
      $or: [
        { sender: currentUser, reciever: id },
        { sender: id, reciever: currentUser },
      ],
    });

    //if there is no request initiated
    if (!request) {
      return res.json({
        message: "No Request found || Invalid request",
      });
    }

    //if the request is already accepted
    if (request.status === "accepted") {
      return res.json({
        message: "Request already accepted",
      });
    }

    //accept the request if pending
    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $push: { friends: request.reciever },
    });
    await User.findByIdAndUpdate(request.reciever, {
      $push: { friends: request.sender },
    });

    //get reciever or accepter for message formatting
    const accepter = await User.findById(request.reciever).select("username");
    return res.json({
      message: `Request accepted by ${accepter.username}`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get friend requests
export const getFriendRequests = async (req, res) => {
  //get friend requests for the current user logged in
  //get it from the RequestLog DB
  //where in the reciever field the curent logged in user id is present
  //and the status is pending
  //if there are no requests , then simply return a message stating no pending requests
  const currentUser = req.user;
  try {
    const friendrequests = await friendReq.find({
      $and: [{ reciever: currentUser._id }, { status: "pending" }],
    }).populate("sender" , "username college profileImage");

    if(!friendrequests){
        return res.json({
            message : "No pending requests as of now"
        })
    }


    return res.json(friendrequests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
