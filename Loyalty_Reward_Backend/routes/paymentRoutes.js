import express from "express";
import {
  checkout,
  paymentVerification,
} from "../controllers/paymentController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/checkout").post(checkout);

// router.route("/paymentverification").post(paymentVerification);
router.post("/paymentverification", requireSignIn, paymentVerification);

export default router;
