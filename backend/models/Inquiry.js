import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["quote", "contact", "whatsapp"], default: "quote" },
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, trim: true, default: "" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, default: "" },
    quantity: { type: String, default: "" },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "closed"],
      default: "new",
    },
    source: { type: String, default: "website" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
