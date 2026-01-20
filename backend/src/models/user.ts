import { Schema, model, Document } from "mongoose";
import { hash, compare } from "bcrypt";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profilePicture: string;
  isActive: boolean;
  role: string;
  otp: string | null;
  otpExpiry: Date | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(userPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
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
      unique: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email address",
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => {
          return /^[0-9]{10}$/.test(v);
        },
        message: "Invalid phone number",
      },
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "employee"],
      default: "customer",
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (userPassword: string) {
  return compare(userPassword, this.password);
};

const User = model<IUser>("User", userSchema);

export default User;
