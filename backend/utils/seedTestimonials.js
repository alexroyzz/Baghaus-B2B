import Testimonial from "../models/Testimonial.js";

export const initialTestimonials = [
  { seedKey: "initial-sujeet-singh", customerName: "Sujeet Singh", reviewText: "Best quality product, best service.", rating: 5, published: true, displayOrder: 0 },
  { seedKey: "initial-purvi-sharma", customerName: "Purvi Sharma", reviewText: "Great product with impressive quality.", rating: 5, published: true, displayOrder: 1 },
  { seedKey: "initial-kajal-kumari", customerName: "Kajal Kumari", reviewText: "Beautiful design and great value for money.", rating: 5, published: true, displayOrder: 2 },
  { seedKey: "initial-divya-kumari", customerName: "Divya Kumari", reviewText: "Excellent quality and neat stitching. Highly recommended.", rating: 5, published: true, displayOrder: 3 },
  { seedKey: "initial-zoya-khan", customerName: "Zoya Khan", reviewText: "Lightweight, spacious, and easy to carry.", rating: 5, published: true, displayOrder: 4 },
];

export const seedInitialTestimonials = async () => {
  let created = 0;
  for (const entry of initialTestimonials) {
    const { seedKey, customerName, reviewText } = entry;
    const alreadySeeded = await Testimonial.findOne({ seedKey }).select("+seedKey");
    if (alreadySeeded) continue;

    // Adopt a matching record created by the earlier seed implementation so
    // existing sites do not receive a duplicate during this upgrade.
    const legacySeed = await Testimonial.findOne({ customerName, reviewText }).select("+seedKey");
    if (legacySeed) {
      legacySeed.seedKey = seedKey;
      try {
        await legacySeed.save();
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
      continue;
    }

    try {
      await Testimonial.create(entry);
      created += 1;
    } catch (error) {
      // Sparse unique index protects against two seed processes racing.
      if (error.code !== 11000) throw error;
    }
  }
  return created;
};
