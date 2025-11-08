import {StreamChat} from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.log("Please set STREAM_API_KEY and STREAM_API_SECRET in .env file");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const insertUpdateUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.log(error.message)
  }
};


export const generateToken = async(userid) =>{
  try {
    return await streamClient.createToken(userid);
  } catch (error) {
    console.log(error.message)
  }
}
