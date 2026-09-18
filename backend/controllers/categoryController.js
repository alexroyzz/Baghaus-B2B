import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { deleteCloudinaryImage } from "../utils/cloudinary.js";

export const getCategories = async (req, res, next) => {
  try {
    const filter = req.query.all === "true" ? {} : { active: true };
    const categories = await Category.find(filter).sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const existing = await Category.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Category not found." });

    const oldPublicId = existing.image?.public_id;
    const newPublicId = req.body.image?.public_id;

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Image was replaced or removed - clean up the old Cloudinary asset.
    if (oldPublicId && oldPublicId !== newPublicId) {
      await deleteCloudinaryImage(oldPublicId);
    }

    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productCount} linked product(s). Reassign or delete them first.`,
      });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });

    if (category.image?.public_id) await deleteCloudinaryImage(category.image.public_id);

    res.json({ success: true, message: "Category deleted." });
  } catch (err) {
    next(err);
  }
};
