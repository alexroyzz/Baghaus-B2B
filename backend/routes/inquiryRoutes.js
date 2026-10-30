import express from "express";
import {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry,
  getInquiryStats,
} from "../controllers/inquiryController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createInquiry);
router.get("/", protect, getInquiries);
router.get("/stats", protect, getInquiryStats);
router.put("/:id", protect, updateInquiry);
router.delete("/:id", protect, deleteInquiry);

export default router;
