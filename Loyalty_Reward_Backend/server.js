import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import loyaltyRoutes from "./routes/loyaltyRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import DecisionTree from "decision-tree";
import paymentRoute from "./routes/paymentRoutes.js";
import Razorpay from "razorpay";
import chainRoutes from "./routes/chainRoutes.js";

// import { generatePURCHASEToken } from "./cronjobs.js";
import  {autoExpire, generatePURCHASEToken, generateREFERALToken, generateSELLERCUSTOMERToken}  from "./cronjobs.js";
const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

//databse config
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//rest object

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));
//routes
app.use("/api/v1/loyaltyRewards", loyaltyRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/chain",chainRoutes)
app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.post("/api/autoexpire", async (req, res) =>
{
  try {
    const {addr}= req.body
    await autoExpire(addr);
    res.status(200).json({ success:true })
  } catch (error) {
    res.status(500).json({success:false});
  }
}
  
);
//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});

//Calling Scedulers

generatePURCHASEToken();
generateREFERALToken();
// generatePURCHASEToken();
generateSELLERCUSTOMERToken();