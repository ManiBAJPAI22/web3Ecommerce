import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isSeller: {
      type: Number,
      default: 0,
    },
    imgUrl: {
      type: String,
      default: 'https://flipkarbucket.s3.ap-south-1.amazonaws.com/users/default-avatar.png'
    },
    refCode: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
