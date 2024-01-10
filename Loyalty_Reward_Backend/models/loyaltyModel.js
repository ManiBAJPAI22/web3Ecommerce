import mongoose from "mongoose";

const loyaltySchema = new mongoose.Schema(
  {
    purchaseAmount: {
        type: Number,
        required: true,
    },
    loyaltyRewardAmount: {
        type: Number,
        required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("loyalty", loyaltySchema);
