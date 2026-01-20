import { Request, Response, NextFunction } from "express";

import User from "../models/user";
import { HttpError } from "../utils/HttpError";
import { sendEmail } from "../utils/sendEmail";
import { otpTemplate } from "../utils/emailTemplates";
import { generateToken, verifyToken } from "../utils/jwt";

/**
 * Validates if a user email exists and is active
 * @param req Express Request object containing email in body
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with user details if email is valid
 * @throws HttpError with status 404 if user not found
 * @throws HttpError with status 401 if user is not active
 * @throws HttpError with status 500 if operation fails
 */
export const checkEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new HttpError("User not found", 404);
      return next(error);
    }

    if (!user.isActive) {
      const error = new HttpError(
        "User is not active, please contact admin",
        401
      );
      return next(error);
    }

    res.status(200).json({
      message: "Email checked successfully",
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Authenticates user with email and password
 * @param req Express Request object containing email and password
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with auth token and user details
 * @throws HttpError with status 404 if user not found
 * @throws HttpError with status 401 if password is invalid
 * @throws HttpError with status 500 if operation fails
 */
export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new HttpError("User not found", 404);
      return next(error);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      const error = new HttpError("Invalid password", 401);
      return next(error);
    }

    const token = generateToken(user._id as string);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        isActive: user.isActive,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Generates and sends OTP to user's email
 * @param req Express Request object containing email
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response confirming OTP generation
 * @throws HttpError with status 404 if user not found
 * @throws HttpError with status 500 if email sending fails
 */
export const generateOtpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new HttpError("User not found", 404);
      return next(error);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    await sendEmail(
      user.email,
      "Your Login OTP",
      otpTemplate(otp, user.firstName)
    );

    res.status(200).json({ message: "OTP generated successfully" });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Verifies OTP and generates auth token
 * @param req Express Request object containing email and OTP
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with auth token and user details
 * @throws HttpError with status 404 if user not found
 * @throws HttpError with status 401 if OTP is invalid or expired
 * @throws HttpError with status 500 if operation fails
 */
export const verifyOtpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new HttpError("User not found", 404);
      return next(error);
    }

    if (user.otp !== otp) {
      const error = new HttpError("Invalid OTP", 401);
      return next(error);
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      const error = new HttpError("OTP expired", 401);
      return next(error);
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateToken(user._id as string);

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        isActive: user.isActive,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Validates JWT token and returns user details
 * @param req Express Request object with Bearer token in Authorization header
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with token validity and user details
 * @throws HttpError with status 401 if token is missing or invalid
 * @throws HttpError with status 404 if user not found
 * @throws HttpError with status 500 if operation fails
 */
export const verifyTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      const error = new HttpError("Not authorized", 401);
      return next(error);
    }

    const decoded = verifyToken(token) as { userId: string };

    if (!decoded) {
      const error = new HttpError("Invalid token", 401);
      return next(error);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      const error = new HttpError("User not found", 404);
      return next(error);
    }

    res.status(200).json({
      message: "Token verified successfully",
      valid: true,
      token,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        isActive: user.isActive,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};
