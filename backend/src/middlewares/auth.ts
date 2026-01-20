import { Request, Response, NextFunction } from "express";

import { verifyToken } from "../utils/jwt";
import User from "../models/user";
import { HttpError } from "../utils/HttpError";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      const error = new HttpError("User not authorized", 401);
      return next(error);
    }

    // Verify token
    const decoded = verifyToken(token) as { userId: string };

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      const error = new HttpError("User not found", 404);
      return next(error);
    }

    // Add user to request
    req.user = user;

    next();
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") {
    const error = new HttpError("Admin access required", 403);
    return next(error);
  }

  next();
};

export const employeeOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role !== "employee") {
    const error = new HttpError("Employee access required", 403);
    return next(error);
  }

  next();
};
