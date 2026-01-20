import { Request, Response, NextFunction } from "express";
import fs from "fs";

import { HttpError } from "../utils/HttpError";
import User from "../models/user";
import { generatePassword } from "../utils/generatePassword";

/**
 * Retrieves all users with optional role filtering
 * @param req Express Request object with optional role query parameter
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with array of user objects
 * @throws HttpError with status 500 if database operation fails
 */
export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.query;

    const users = await User.find({ role });

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Creates a new user with profile picture
 * @param req Express Request object containing user details and profile picture
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with created user details
 * @throws HttpError with status 400 if user already exists
 * @throws HttpError with status 500 if file upload or database operation fails
 */
export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;
    const files = req.files as { [key: string]: Express.Multer.File[] };

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      const err = new HttpError("User already exists", 400);
      return next(err);
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: password || generatePassword(),
      profilePicture: files.profile[0].path,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Retrieves details of a specific user
 * @param req Express Request object with user ID parameter
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with user details
 * @throws HttpError with status 404 if user not found
 * @throws HttpError with status 500 if database operation fails
 */
export const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Updates user information
 * @param req Express Request object with user ID parameter and updated details
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with updated user details
 * @throws HttpError with status 404 if user not found
 * @throws HttpError with status 500 if database operation fails
 */
export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, role } = req.body;

    const user = await User.findById(id);

    if (!user) {
      const err = new HttpError("User not found", 404);
      return next(err);
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.role = role;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Deletes a user and their associated profile picture
 * @param req Express Request object with user ID parameter
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response confirming deletion
 * @throws HttpError with status 400 if attempting to delete master admin
 * @throws HttpError with status 404 if user not found
 * @throws HttpError with status 500 if deletion or file removal fails
 */
export const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user?.email === "gyandors@gmail.com") {
      const err = new HttpError("Cannot delete master admin", 400);
      return next(err);
    }

    if (!user) {
      const err = new HttpError("User not found", 404);
      return next(err);
    }

    await user.deleteOne();

    user.profilePicture &&
      fs.unlink(user.profilePicture, (err) => {
        if (err) console.error(err);
      });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};
