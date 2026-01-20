import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/user";

dotenv.config();

// Run the script using ts-node
// npx ts-node src/scripts/createAdmin.ts
export async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const newAdmin = new User({
      firstName: "Sachin",
      lastName: "Gyandor",
      email: "gyandors@gmail.com",
      phone: "9845300646",
      password: "gyandors",
      profilePicture:
        "https://ugc.production.linktr.ee/1efed75f-e723-4278-af2d-65d8cdd552cc_IMG-20231002-094835.jpeg",
      role: "admin",
    });

    await newAdmin.save();

    console.log("Admin created successfully");
    process.exit(0);
  } catch (error: any) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
