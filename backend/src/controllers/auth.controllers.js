import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";
import bcrypt from "bcryptjs";
import { insertUpdateUser } from "../lib/stream.js";

//Development Thoughts :
// 1.I first of all thought of making the users create a unique username , but that will be a hassle for the user if the combination come up frquent patterns already in the db , so
// it's better to go ahead with email as the unique identifier
//2.I thought to go with real pics to set profiles but that destroys the whole point of anonymity , so I'm going with a random avatar generator

//Signup Controller
export const signupController = async (req, res) => {
  const { username, email, password, college } = req.body;

  try {
    //validation checks

    //1. Check if all fields are filled
    if (!username || !email || !password || !college) {
      return res.json({
        message: "All fields are required",
      });
    }

    //2. Check if email regex is correct
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.json({
        message: "Invalid email",
      });
    }

    //3.Check if password length is greater than 8 characters
    if (password.length < 8) {
      return res.json({
        message: "Password should be greater than 8 characters",
      });
    }

    //4. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        message: "User already exists",
      });
    }

    //setting up random avatars to maintain anonymity
    const avatar = `https://avatar.iran.liara.run/public`;

    const user = await User.create({
      username,
      email,
      password,
      college,
      profileImage: avatar,
    });
    await user.save();

    //creating a user in stream
    try {
      await insertUpdateUser({
        id: user._id.toString(),
        username: user.username,
        profileImage: user.profileImage || "",
        college: user.college,
      });
    } catch (error) {
      console.log(error.message);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      httpOnly: true, //prvents Cross site scripting attacks
      sameSite: "strict", //prevents Cross Site Request Forgery attacks
      secure: process.env.NODE_ENV === "production", //wil use only HTTPS connection in Production
      maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
    });

    return res.json({
      message: "user created successfully",
      id: user._id,
      name: user.username,
      email: user.email,
      college: user.college,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

//Login Controller
export const loginController = async (req, res) => {
  const { email, password } = req.body;

  //Validation checks:
  //Check whether user exists
  //Compare the hashed password in the db
  //if finds a match , generate a token and send it back
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "user not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        message: "Invalid Credentials",
      });
    }

    //generate the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    //set cookie
    res.cookie("jwt", token, {
      httpOnly: true, //prvents Cross site scripting attacks
      sameSite: "strict", //prevents Cross Site Request Forgery attacks
      secure: process.env.NODE_ENV === "production", //wil use only HTTPS connection in Production
      maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
    });

    //return the response of the logged in user
    return res.json({
      message: "user logged in successfully",
      id: user._id,
      username: user.username,
      email: user.email,
      college: user.college,
      profileImage: user.profileImage,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

//logout controller
export const logoutController = async (req, res) => {
  try {
    //set the cookies as null on logout to prevent unauthorized access
    res.cookie("jwt", "", {
      httpOnly: true, //prvents Cross site scripting attacks
      sameSite: "strict", //prevents Cross Site Request Forgery attacks
      secure: process.env.NODE_ENV === "production", //wil use only HTTPS connection in Production
      maxAge: new Date(0), //expires immediately
    });

    res.cookie("token", "", {
      httpOnly: true, //prvents Cross site scripting attacks
      sameSite: "strict", //prevents Cross Site Request Forgery attacks
      secure: process.env.NODE_ENV === "production", //wil use only HTTPS connection in Production
      maxAge: new Date(0), //expires immediately
    });
    return res.json({
      message: "user logged out successfully",
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

//loggedin profile controller
export const loggedinProfile = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: req.user,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};
