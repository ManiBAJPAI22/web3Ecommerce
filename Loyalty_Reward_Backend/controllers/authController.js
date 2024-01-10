import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import sellerModel from "../models/sellerModel.js";
import admin from "firebase-admin";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import _ from 'lodash'
import referralCodes from "referral-codes";
import userReferralModel from "../models/userReferral.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer, isSeller, imgUrl, userRef } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {  
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const randomGeneratedReferralCode = referralCodes.generate({
      length: 8,
      count: 1,
    });;
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      isSeller,
      imgUrl,
      refCode: randomGeneratedReferralCode[0]
    }).save();
    if(isSeller == 1) {
      const seller = await new sellerModel({
        userId: user._id,
        name,
        email,
        phone,
        address,
      }).save();
    }
    if(userRef) {
      const senderUserReferral = await userModel.findOne({
        refCode: userRef
      });
      userReferralModel.create({
        senderUserId: _.toString(senderUserReferral._id),
        consumerUserId: _.toString(user._id),
        referralCode: userRef,
        awarded: false
    })
    }
    res.status(200).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    if(user.isSeller) {
      const sellerAccDetails = await sellerModel.findOne({userId: user._id});
      if(!_.isEmpty(sellerAccDetails)) {
        user.sellerId = sellerAccDetails._id;
        res.status(200).send({
          success: true,
          message: "login successfully",
          user:{
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isSeller: user.isSeller,
            imgUrl: user.imgUrl,
            sellerId: user.sellerId,
            refCode: user.refCode,
          },
          token,
        });
      }
    } else {
      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          isSeller: user.isSeller,
          imgUrl: user.imgUrl,
          refCode: user.refCode
        },
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
// export const phoneVerify = async (req, res) => {
//   try {
//     // const { orderId } = req.params;
//     const { phoneN } = req.body;
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//       databaseURL: "https://rentalbike-28d8d.firebaseio.com", // Replace with your Firebase project URL
//     });
//     async function sendOTP(phoneNumber) {
//       try {
//         const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
//         const settings = {
//           phoneNumber: phoneN,
//           recaptchaToken: null, // Optional, add a reCAPTCHA token if you want to enable reCAPTCHA verification.
//         };
//         const verificationResult = await auth().createSessionCookie(
//           verificationCode,
//           { expiresIn: 86400 }
//         ); // Set expiration time for OTP (in seconds)

//         // Send the verificationResult to the user (e.g., through SMS or email)
//         console.log("OTP sent:", verificationCode);

//         return verificationResult;
//       } catch (error) {
//         console.error("Error sending OTP:", error);
//         throw error;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "errorr in phone verification",
//       error,
//     });
//   }
// };
