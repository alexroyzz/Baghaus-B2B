import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true, maxlength: 2048, match: /^https?:\/\/.+/i },
    public_id: { type: String, trim: true, default: "", maxlength: 255 },
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    // Internal stable key for seeded reviews; hidden and excluded from admin API writes.
    seedKey: { type: String, select: false },
    customerName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    reviewText: { type: String, required: true, trim: true, minlength: 3, maxlength: 1000 },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
      validate: { validator: Number.isInteger, message: "Rating must be a whole number from 1 to 5." },
    },
    photo: { type: photoSchema, default: undefined },
    published: { type: Boolean, default: true, index: true },
    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
      max: 1_000_000,
      validate: { validator: Number.isInteger, message: "Display order must be a non-negative whole number." },
    },
  },
  { timestamps: true }
);

testimonialSchema.index({ published: 1, displayOrder: 1, createdAt: 1 });
testimonialSchema.index({ seedKey: 1 }, { unique: true, sparse: true });

export default mongoose.model("Testimonial", testimonialSchema);
