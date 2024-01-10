import express from "express";
import { expireToken, getNftByWallet, getNftByWalletEXP, setAddr } from "../controllers/chainController.js";
import { getNFTDataByWalletExp } from "../helpers/contractHelper.js";

const router = express.Router();

router.post("/set-address", setAddr);
router.post("/getnftbywallet",getNftByWallet)
router.post("/getnftbywalletEXP",getNftByWalletEXP)

router.post('/expireToken',expireToken)

export default router;