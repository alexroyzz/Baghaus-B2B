import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { deleteCloudinaryImages } from "../utils/cloudinary.js";

// Verifies the given category id refers to an existing Category document.
// Categories must be created/managed explicitly from Category Management;
// products should never trigger creation of a new category.
const categoryExists = async (categoryId) => {
  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) return false;
  const category = await Category.findById(categoryId).select("_id");
  return Boolean(category);
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, featured, search, page = 1, limit = 12, all } = req.query;
    const filter = all === "true" ? {} : { active: true };

    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("category", "name slug");
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    if (!(await categoryExists(req.body.category))) {
      return res.status(400).json({
        success: false,
        message: "Selected category does not exist. Please choose a valid category from Category Management.",
      });
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Product not found." });

    if (req.body.category !== undefined && !(await categoryExists(req.body.category))) {
      return res.status(400).json({
        success: false,
        message: "Selected category does not exist. Please choose a valid category from Category Management.",
      });
    }

    const oldIds = (existing.images || []).map((img) => img.public_id).filter(Boolean);
    const newIds = new Set((req.body.images || []).map((img) => img?.public_id).filter(Boolean));
    const removedIds = oldIds.filter((id) => !newIds.has(id));

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (removedIds.length) await deleteCloudinaryImages(removedIds);

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });

    const publicIds = (product.images || []).map((img) => img.public_id).filter(Boolean);
    if (publicIds.length) await deleteCloudinaryImages(publicIds);

    res.json({ success: true, message: "Product deleted." });
  } catch (err) {
    next(err);
  }
};
