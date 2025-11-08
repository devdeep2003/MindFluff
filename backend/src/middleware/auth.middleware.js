import { verifyToken } from "../utils/verifyToken.js";
import User from "../models/user.schema.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.json({
      message: "No token provided",
    });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.json({
        message: "Invalid token",
      });
    }
    
    const user = await User.findById(decoded.id).select("-password");
    if(!user){
        return res.json({
            message: "Invalid token",
        })
    }
    req.user = user;
    next();
  } catch (error) {
    return res.json({
        message : error.message
    })
  }
};
