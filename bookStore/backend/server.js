import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { connectDB } from "./config/db.js";
import { router } from "./routes/registerApi.js";

import addBookRouter from "./routes/addBookApi.js";
import couponRouter from "./routes/couponApi.js"
import checkoutRouter from "./routes/checkoutApi.js"

const app = express();

app.set("trust proxy", 1);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// db connection
connectDB();

// routes
app.use("/users", router);
app.use("/uploads", express.static("uploads"));
app.use("/books", addBookRouter);
app.use("/coupon", couponRouter);
app.use("/checkout", checkoutRouter);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});