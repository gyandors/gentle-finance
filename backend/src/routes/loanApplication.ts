import { Router } from "express";
import { uploadFields } from "../middlewares/fileUpload";

import {
  getAllLoansHandler,
  applyLoanHandler,
  loanStatusHandler,
  updateLoanHandler,
  deleteLoanHandler,
} from "../controllers/loanApplication";
import { adminOnly, protect } from "../middlewares/auth";

const router = Router();

router.post("/apply-loan", uploadFields, applyLoanHandler);

router.get("/loan-status/:applicationId", loanStatusHandler);

router.get("/", protect, adminOnly, getAllLoansHandler);

router.patch(
  "/update-loan/:applicationId",
  protect,
  adminOnly,
  updateLoanHandler
);

router.delete(
  "/delete-loan/:applicationId",
  protect,
  adminOnly,
  deleteLoanHandler
);

export default router;
