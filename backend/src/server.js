import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.config.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();

//creating instance
const app = express();

const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cookieParser());
//cors definition
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//route middlewares
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname , "../frontend/dist")));

  app.get("*" , (req,res)=>{
    res.sendFile(path.join(__dirname , "../frontend" , "dist" , "index.html"))
  })
}

//Home route
app.get("/", (req, res) => {
  res.send("CampusCare Backend is running");
});

//listen the server
app.listen(process.env.PORT || 3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});
