import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Create folders if they don't exist
const createFolders = () => {
  const folders = ["uploads/profile", "uploads/aadhar", "uploads/pan"];
  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      console.log("Creating folder", folder);
      fs.mkdirSync(folder, { recursive: true });
    }
  });
};
createFolders();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const documentType = file.fieldname;
    let uploadFolder = "uploads/";

    switch (documentType) {
      case "profile":
        uploadFolder += "profile/";
        break;
      case "aadhar":
        uploadFolder += "aadhar/";
        break;
      case "pan":
        uploadFolder += "pan/";
        break;
      default:
        uploadFolder += "other/";
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "_" + file.originalname);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  limits: {
    fileSize: 2000000, // 2MB limit
  },
  storage,
  fileFilter,
});

export const uploadFields = upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
]);
