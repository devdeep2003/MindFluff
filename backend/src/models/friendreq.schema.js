import mongoose from "mongoose";

const friendReqSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    reciever : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    status : {
        type : String,
        enum : ["pending" , "accepted"],
        default : "pending"
    }
})

const friendReq = mongoose.model("RequestLog" , friendReqSchema)
export default friendReq