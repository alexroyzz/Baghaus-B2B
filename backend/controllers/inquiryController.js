import Inquiry from "../models/Inquiry.js";

// Public - submit an inquiry (Request Quote / Contact form / WhatsApp click log)
export const createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "Name, email and phone are required." });
    }
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({
      success: true,
      message: "Thank you! Your inquiry has been received. Our team will contact you shortly.",
      data: inquiry,
    });
  } catch (err) {
    next(err);
  }
};

// Admin - list inquiries
export const getInquiries = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (Number(page) - 1) * Number(limit);
    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate("product", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Inquiry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: inquiries,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

export const updateInquiry = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found." });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found." });
    res.json({ success: true, message: "Inquiry deleted." });
  } catch (err) {
    next(err);
  }
};

export const getInquiryStats = async (req, res, next) => {
  try {
    const [total, newCount, byType] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "new" }),
      Inquiry.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
    ]);
    res.json({ success: true, data: { total, newCount, byType } });
  } catch (err) {
    next(err);
  }
};
