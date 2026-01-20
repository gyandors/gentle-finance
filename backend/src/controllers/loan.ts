import { Request, Response, NextFunction } from "express";

import Loan from "../models/loan";
import { HttpError } from "../utils/HttpError";

export const createLoanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getLoanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
