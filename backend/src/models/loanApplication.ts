import { Schema, model } from "mongoose";

const loanApplicationSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    applicationId: {
      type: String,
      required: true,
    },
    documents: [
      {
        type: {
          type: String,
          enum: ["AADHAR", "PAN", "OTHER"],
          required: true,
        },
        filename: { type: String, required: true },
        path: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const LoanApplication = model("LoanApplication", loanApplicationSchema);

export default LoanApplication;
