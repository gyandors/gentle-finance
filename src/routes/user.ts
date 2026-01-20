import { Router } from "express";
import {
  createUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  getUserHandler,
  updateUserHandler,
} from "../controllers/user";
import { uploadFields } from "../middlewares/fileUpload";

const router = Router();

router.get("/", getAllUsersHandler);

router.post("/create", uploadFields, createUserHandler);

router.get("/:id", getUserHandler);

router.delete("/:id", deleteUserHandler);

router.put("/:id", updateUserHandler);

export default router;
