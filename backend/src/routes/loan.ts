import { Router } from "express";
import { createLoanHandler, getLoanHandler } from "../controllers/loan";

const router = Router();

router.post("/create", createLoanHandler);

router.get("/:loanId", getLoanHandler);

export default router;
