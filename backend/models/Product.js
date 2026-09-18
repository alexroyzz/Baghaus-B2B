import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    sku: { type: String, trim: true, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    shortDescription: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: "" },
      },
    ],
    materials: [{ type: String }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    compartment: { type: String, trim: true, default: "" },
    closureType: { type: String, trim: true, default: "" },
    moq: { type: Number, default: 50 }, // minimum order quantity
    priceRange: { type: String, default: "" }, // e.g. "$8 - $14 / unit (FOB)"
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    tags: [{ type: String }],
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + "-" + Math.random().toString(36).slice(2, 7);
  }
  next();
});

export default mongoose.model("Product", productSchema);
