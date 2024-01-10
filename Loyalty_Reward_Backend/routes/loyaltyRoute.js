import express from "express";
import {addLoyalty, updateLoyalty, deleteLoyalty} from "../controllers/loyaltyController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/addLoyalty", addLoyalty);

// router.route("/paymentverification").post(paymentVerification);
router.post("/updateLoyalty/:id", updateLoyalty);

router.post("/deleteLoyalty/:id", deleteLoyalty)
export default router;
