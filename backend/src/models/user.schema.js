import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    profileImage: {
      type: "String",
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("users", userSchema);
export default User;
