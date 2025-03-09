import express from "express";
import { uploadAvatarImage } from "../controller/uploadController.js";

const router = express.Router();

// Endpoint để tải lên hình ảnh
router.post("/upload-avatar", uploadAvatarImage);

export default router;
