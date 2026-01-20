import { Router } from "express";
import {
  checkEmailHandler,
  loginHandler,
  verifyOtpHandler,
  generateOtpHandler,
  verifyTokenHandler,
} from "../controllers/auth";

const router = Router();

router.post("/check-email", checkEmailHandler);

router.post("/login", loginHandler);

router.post("/verify-otp", verifyOtpHandler);

router.post("/generate-otp", generateOtpHandler);

router.get("/verify-token", verifyTokenHandler);

export default router;
