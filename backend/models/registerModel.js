import mongoose from "mongoose";

// db table struct
const userSchema = new mongoose.Schema({
  username: String,

  contact: Number,

  email: String,  

  createPassword: String,
  
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
});

export const User = mongoose.model("User", userSchema);
