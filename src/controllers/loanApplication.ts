import { Request, Response, NextFunction } from "express";
import fs from "fs";

import LoanApplication from "../models/loanApplication";
import { HttpError } from "../utils/HttpError";
import { generateId } from "../utils/generateId";

/**
 * Retrieves all loan applications with optional status filtering
 * @param req Express Request object with optional status query parameter
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with loan applications data
 * @throws HttpError with status 500 if database operation fails
 */
export const getAllLoansHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loanApplications = await LoanApplication.find({
      status: req.query.status,
    });

    res.json({
      message: "Loan applications fetched successfully",
      data: loanApplications,
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Handles new loan application submission with document uploads
 * @param req Express Request object containing loan application data and files
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with application ID on success
 * @throws HttpError with status 400 if:
 *  - Required documents are missing
 *  - User has a pending application
 *  - User has applied within last 30 days
 * @throws HttpError with status 500 if file upload or database operation fails
 */
export const applyLoanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, phone, amount, purpose } = req.body;
    const files = req.files as { [key: string]: Express.Multer.File[] };

    if (!files.aadhar || !files.pan) {
      const err = new HttpError("Aadhar card and PAN card are required", 400);
      return next(err);
    }

    const existingLoanApplication = await LoanApplication.findOne({
      $or: [{ email }, { phone }],
    });

    if (
      existingLoanApplication &&
      existingLoanApplication.status === "PENDING"
    ) {
      const err = new HttpError(
        "Loan application already exists, please wait for approval",
        400
      );
      return next(err);
    }

    if (
      existingLoanApplication &&
      existingLoanApplication.createdAt >
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
    ) {
      const err = new HttpError(
        "Please wait for 30 days before submitting a new application",
        400
      );
      return next(err);
    }

    const loanApplication = new LoanApplication({
      firstName,
      lastName,
      email,
      phone,
      amount,
      purpose,
      applicationId: generateId(),
      documents: [
        {
          type: "AADHAR",
          filename: files.aadhar[0].filename,
          path: files.aadhar[0].path,
        },
        {
          type: "PAN",
          filename: files.pan[0].filename,
          path: files.pan[0].path,
        },
      ],
    });

    await loanApplication.save();

    res.status(201).json({
      message: "Loan application submitted successfully",
      data: {
        applicationId: loanApplication.applicationId,
      },
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Retrieves the status of a specific loan application
 * @param req Express Request object with applicationId parameter
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with loan application status and details
 * @throws HttpError with status 404 if application not found
 * @throws HttpError with status 500 if database operation fails
 */
export const loanStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { applicationId } = req.params;
    const loanApplication = await LoanApplication.findOne({ applicationId });

    if (!loanApplication) {
      const err = new HttpError("Loan application not found", 404);
      return next(err);
    }

    res.json({
      message: "Loan status fetched successfully",
      data: {
        firstName: loanApplication.firstName,
        lastName: loanApplication.lastName,
        applicationId: loanApplication.applicationId,
        status: loanApplication.status,
        createdAt: loanApplication.createdAt,
      },
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Updates the status of a loan application
 * @param req Express Request object with applicationId parameter and status in body
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response with updated loan application data
 * @throws HttpError with status 404 if application not found
 * @throws HttpError with status 500 if database operation fails
 */
export const updateLoanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const loanApplication = await LoanApplication.findOne({ applicationId });

    if (!loanApplication) {
      const err = new HttpError("Loan application not found", 404);
      return next(err);
    }

    loanApplication.status = status || "PENDING";
    await loanApplication.save();

    res.status(200).json({
      message: "Loan application updated successfully",
      data: loanApplication,
    });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};

/**
 * Deletes a loan application and its associated documents
 * @param req Express Request object with applicationId parameter
 * @param res Express Response object
 * @param next Express NextFunction
 * @returns JSON response confirming deletion
 * @throws HttpError with status 404 if application not found
 * @throws HttpError with status 500 if deletion or file removal fails
 */
export const deleteLoanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { applicationId } = req.params;
    const loanApplication = await LoanApplication.findOne({ applicationId });

    if (!loanApplication) {
      const err = new HttpError("Loan application not found", 404);
      return next(err);
    }

    await loanApplication.deleteOne();

    loanApplication.documents.forEach((document) => {
      fs.unlink(document.path, (err) => {
        if (err) console.error(err);
      });
    });

    res.status(200).json({ message: "Loan application deleted successfully" });
  } catch (error: any) {
    const err = new HttpError(error.message, 500);
    next(err);
  }
};
