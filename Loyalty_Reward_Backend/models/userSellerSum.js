import mongoose from "mongoose";

const userSellerSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sellers"
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    rewardsArray: [
        {
            amount: {
                type: Number,
            },
            given: {
                type: Boolean
            }
        }
    ],
    addr: {
        type: String,
    },
    tokenTransID:{
        type: String
      }
  },
  { timestamps: true }
);

export default mongoose.model("userSeller", userSellerSchema);
