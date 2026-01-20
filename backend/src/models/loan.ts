import { Schema, model, Types } from "mongoose";

const loanSchema = new Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    term: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    status: { type: String, required: true },
    transactions: [{ type: String, amount: Number, date: Date }],
    userId: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false }
);

const Loan = model("Loan", loanSchema);

export default Loan;
