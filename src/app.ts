import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";

import loanApplicationRoutes from "./routes/loanApplication";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import { adminOnly, protect } from "./middlewares/auth";
import loanRoutes from "./routes/loan";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/loan-application", loanApplicationRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/user", protect, adminOnly, userRoutes);

app.use("/api/loan", loanRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [key: string]: Express.Multer.File[] };
  if (files && files.aadhar) {
    fs.unlink(files.aadhar[0].path, (err) => {
      if (err) console.error(err);
    });
  }
  if (files && files.pan) {
    fs.unlink(files.pan[0].path, (err) => {
      if (err) console.error(err);
    });
  }
  if (files && files.profile) {
    fs.unlink(files.profile[0].path, (err) => {
      if (err) console.error(err);
    });
  }

  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => console.log("Server is running on port", PORT));
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
