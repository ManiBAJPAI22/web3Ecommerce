import mongoose from "mongoose";

const userReferralSchema = new mongoose.Schema(
  {
    senderUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    consumerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    referralCode: {
        type: String,
        required: true
    },
    awarded:{
        type: Boolean,
        required: true
    },
    senderAddr:{
      type:String
    },
    receiverAddr :{
      type :String
    },
    sendertokenTransID:{
      type: String
    },
    receivertokenTransID :{
      type:String
    },
    nftTokenValue :{
      type :Number,
      default:200,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("userReferral", userReferralSchema);
