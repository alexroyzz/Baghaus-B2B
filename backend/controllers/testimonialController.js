import mongoose from "mongoose";
import Testimonial from "../models/Testimonial.js";
import { deleteCloudinaryImage } from "../utils/cloudinary.js";

const fields = ["customerName", "reviewText", "rating", "photo", "published", "displayOrder"];
const validatePayload = (body, current = {}) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "A testimonial object is required.";
  if (Object.keys(body).some((key) => !fields.includes(key))) return "Unsupported testimonial field.";
  const data = Object.fromEntries(fields.filter((key) => current[key] !== undefined).map((key) => [key, current[key]]));
  for (const key of fields) if (Object.hasOwn(body, key)) data[key] = body[key];
  if (!current.customerName && !Object.hasOwn(body, "customerName")) return "Customer name is required.";
  if (!current.reviewText && !Object.hasOwn(body, "reviewText")) return "Review text is required.";
  if (typeof data.customerName !== "string" || data.customerName.trim().length < 2 || data.customerName.trim().length > 80) return "Customer name must be 2 to 80 characters.";
  if (typeof data.reviewText !== "string" || data.reviewText.trim().length < 3 || data.reviewText.trim().length > 1000) return "Review text must be 3 to 1000 characters.";
  data.customerName = data.customerName.trim();
  data.reviewText = data.reviewText.trim();
  data.rating = data.rating === undefined ? 5 : data.rating;
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) return "Rating must be a whole number from 1 to 5.";
  data.displayOrder = data.displayOrder === undefined ? 0 : data.displayOrder;
  if (!Number.isInteger(data.displayOrder) || data.displayOrder < 0 || data.displayOrder > 1_000_000) return "Display order must be a whole number from 0 to 1000000.";
  data.published = data.published === undefined ? true : data.published;
  if (typeof data.published !== "boolean") return "Published status must be true or false.";
  if (data.photo !== undefined && data.photo !== null) {
    if (typeof data.photo !== "object" || typeof data.photo.url !== "string" || !/^https?:\/\/.+/i.test(data.photo.url) || data.photo.url.length > 2048) return "Customer photo must use a valid HTTP or HTTPS URL.";
    if (data.photo.public_id !== undefined && (typeof data.photo.public_id !== "string" || data.photo.public_id.length > 255)) return "Customer photo ID is invalid.";
    data.photo = { url: data.photo.url.trim(), public_id: data.photo.public_id || "" };
  } else data.photo = undefined;
  return data;
};

const validateId = (id, res) => {
  if (mongoose.isValidObjectId(id)) return true;
  res.status(400).json({ success: false, message: "Invalid testimonial ID." });
  return false;
};

export const getPublishedTestimonials = async (_req, res, next) => {
  try {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    const data = await Testimonial.find({ published: true })
      .select("customerName reviewText rating photo.url displayOrder")
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const listTestimonials = async (_req, res, next) => {
  try {
    const data = await Testimonial.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const data = validatePayload(req.body);
    if (typeof data === "string") return res.status(400).json({ success: false, message: data });
    const testimonial = await Testimonial.create(data);
    res.status(201).json({ success: true, data: testimonial, message: "Testimonial created." });
  } catch (err) { next(err); }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    if (!validateId(req.params.id, res)) return;
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found." });
    const data = validatePayload(req.body, testimonial.toObject());
    if (typeof data === "string") return res.status(400).json({ success: false, message: data });
    const oldPhotoId = testimonial.photo?.public_id;
    Object.assign(testimonial, data);
    await testimonial.save();
    if (oldPhotoId && oldPhotoId !== testimonial.photo?.public_id) await deleteCloudinaryImage(oldPhotoId);
    res.json({ success: true, data: testimonial, message: "Testimonial updated." });
  } catch (err) { next(err); }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    if (!validateId(req.params.id, res)) return;
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found." });
    if (testimonial.photo?.public_id) await deleteCloudinaryImage(testimonial.photo.public_id);
    res.json({ success: true, message: "Testimonial deleted." });
  } catch (err) { next(err); }
};
