// import { instance } from "../server";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";
import Razorpay from "razorpay";
import { log } from "console";
import orderModel from "../models/orderModel.js";
import _ from "lodash";
import {hashAmount, compareAmount} from "../helpers/tokenHelper.js";
import userSellerModel  from "../models/userSellerSum.js";
import { user } from "firebase-functions/v1/auth";

// dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

export const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    console.log("====================================");
    console.log(options);
    console.log("====================================");
    const order = await instance.orders.create(options);
    console.log("after odered");
    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.log("checkout error", err);
  }
};

export const paymentVerification = async (req, res) => {
  try {
    console.log("payvaavduavdu", req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, account } =
    req.body;
    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature, account);

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    let totalAmountPayable = 0;
    cart.map((e) => {
      totalAmountPayable+=e.price;
    });
    // const nftTokenValue = await hashAmount(_.toString(totalAmountPayable));
    const order = await orderModel.create({
      products: cart,
      payment: req.body,
      buyer: req.user._id,
      nftTokenValue : Math.floor( totalAmountPayable*0.1 ),
      addr: account
    });
    const sellerIdCostMap = {};
    cart.map((c) => {
      sellerIdCostMap[c.sellerId] = 0;
    })
    cart.map((c) => {
      sellerIdCostMap[c.sellerId]+=c.price;
    })
    const sellerIdCostArray = Object.entries(sellerIdCostMap).map(([id, amount]) => ({sellerId: id, amount: Math.floor(amount)}));
    const userSellerPromises = sellerIdCostArray.map((e) => {
      return userSellerModel.findOne({
        userId: req.user._id,
        sellerId: e.sellerId
      });
    })
    let updateorCreatePromises;
    await Promise.all(userSellerPromises).then((res) => {
      updateorCreatePromises = res.map((r, index) => {
        if(!_.isNull(r)){
          return userSellerModel.findOneAndUpdate({
            userId: req.user._id,
            sellerId: sellerIdCostArray[index].sellerId
          }, {
            amount:  Math.floor(r.amount) + sellerIdCostArray[index].amount,
            addr: account
          })
        } else {
          return userSellerModel.create({
            userId: req.user._id,
            sellerId: sellerIdCostArray[index].sellerId,
            amount: sellerIdCostArray[index].amount,
            addr: account
          })
        }
      })
    }).catch((err) => {
      console.log(err);
    })
    await Promise.all(updateorCreatePromises).then(() => {
      console.log("successfully updated users and sum models");
    }).catch((err) => {
      console.log(err);
    })
    // res.redirect(
    //   `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    // );
    await orderModel.findByIdAndUpdate({
      _id: _.toString(order._id)
    }, {
      status: "done"
    })
    res.json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
    });
  }
  } catch (err) {
    console.log(err);
  }
};
