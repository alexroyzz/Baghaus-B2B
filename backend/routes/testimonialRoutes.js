import express from "express";
import { createTestimonial, deleteTestimonial, getPublishedTestimonials, listTestimonials, updateTestimonial } from "../controllers/testimonialController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/", getPublishedTestimonials);
router.get("/manage", protect, listTestimonials);
router.post("/", protect, createTestimonial);
router.put("/:id", protect, updateTestimonial);
router.delete("/:id", protect, deleteTestimonial);
export default router;
