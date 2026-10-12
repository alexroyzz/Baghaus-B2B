import test from "node:test";
import assert from "node:assert/strict";
import Testimonial from "../models/Testimonial.js";
import { initialTestimonials, seedInitialTestimonials } from "../utils/seedTestimonials.js";

test("initial testimonial seed is idempotent and preserves admin changes", async () => {
  const originalFindOne = Testimonial.findOne;
  const originalCreate = Testimonial.create;
  const rows = [];
  Testimonial.findOne = (filter) => ({
    select: async () => rows.find((row) => Object.entries(filter).every(([key, value]) => row[key] === value)) || null,
  });
  Testimonial.create = async (entry) => { rows.push({ ...entry, async save() {} }); return rows.at(-1); };
  try {
    assert.equal(await seedInitialTestimonials(), 5);
    assert.equal(rows.length, 5);
    assert.equal(rows.every((row) => row.published && row.rating === 5), true);
    rows[0].customerName = "Admin edited name";
    rows[0].reviewText = "Admin edited review";
    rows[0].published = false;
    assert.equal(await seedInitialTestimonials(), 0);
    assert.equal(rows.length, initialTestimonials.length);
    assert.equal(rows[0].customerName, "Admin edited name");
    assert.equal(rows[0].reviewText, "Admin edited review");
    assert.equal(rows[0].published, false);
  } finally {
    Testimonial.findOne = originalFindOne;
    Testimonial.create = originalCreate;
  }
});

test("seed adopts a matching legacy testimonial without replacing its fields", async () => {
  const originalFindOne = Testimonial.findOne;
  const originalCreate = Testimonial.create;
  const legacy = {
    customerName: initialTestimonials[0].customerName,
    reviewText: initialTestimonials[0].reviewText,
    rating: 4,
    published: false,
    displayOrder: 9,
    async save() {},
  };
  const rows = [legacy];
  Testimonial.findOne = (filter) => ({
    select: async () => rows.find((row) => Object.entries(filter).every(([key, value]) => row[key] === value)) || null,
  });
  Testimonial.create = async (entry) => { rows.push({ ...entry, async save() {} }); return rows.at(-1); };
  try {
    assert.equal(await seedInitialTestimonials(), 4);
    assert.equal(rows.length, 5);
    assert.equal(legacy.seedKey, initialTestimonials[0].seedKey);
    assert.equal(legacy.rating, 4);
    assert.equal(legacy.published, false);
    assert.equal(legacy.displayOrder, 9);
  } finally {
    Testimonial.findOne = originalFindOne;
    Testimonial.create = originalCreate;
  }
});
