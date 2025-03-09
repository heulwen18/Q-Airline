import express from "express";
import { getRoles } from "../controller/roleController.js";

const router = express.Router();

router.get("/roles", getRoles);

export default router;
