import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Testimonial from "../models/Testimonial.js";
import { protect } from "../middleware/auth.js";
import routes from "../routes/testimonialRoutes.js";
import { createTestimonial, deleteTestimonial, getPublishedTestimonials, listTestimonials, updateTestimonial } from "../controllers/testimonialController.js";

const id = "64b000000000000000000001";
const records = [
  { _id: id, customerName: "Public Customer", reviewText: "A published review", rating: 4, published: true, displayOrder: 0 },
  { _id: "64b000000000000000000002", customerName: "Private Customer", reviewText: "An unpublished review", rating: 5, published: false, displayOrder: 1 },
];
const response = () => ({ statusCode: 200, headers: {}, status(code) { this.statusCode = code; return this; }, set(key, value) { this.headers[key] = value; return this; }, json(value) { this.body = value; return this; } });
const controllerCall = async (handler, req = {}) => { const res = response(); let error; await handler(req, res, (err) => { error = err; }); if (error) throw error; return res; };

test("public endpoint filters unpublished testimonials and disables caching", async () => {
  Testimonial.find = (filter) => {
    let values = records.filter((item) => filter.published === undefined || item.published === filter.published);
    return { select() { return this; }, sort() { return this; }, lean: async () => values };
  };
  const res = await controllerCall(getPublishedTestimonials);
  assert.deepEqual(res.body.data.map((item) => item.customerName), ["Public Customer"]);
  assert.match(res.headers["Cache-Control"], /no-store/);
});

test("all management routes use the existing admin protection middleware", () => {
  const protectedRoutes = routes.stack.filter((layer) => layer.route && layer.route.path !== "/");
  assert.equal(protectedRoutes.length, 3);
  for (const layer of protectedRoutes) assert.equal(layer.route.stack[0].handle, protect);
});

test("admin list includes published and unpublished records", async () => {
  Testimonial.find = () => ({ sort() { return this; }, lean: async () => records });
  const res = await controllerCall(listTestimonials);
  assert.equal(res.body.data.length, 2);
});

test("create validates fields and returns a created record", async () => {
  Testimonial.create = async (data) => ({ _id: id, ...data });
  const good = await controllerCall(createTestimonial, { body: { customerName: "New Buyer", reviewText: "Excellent quality.", rating: 5, published: false, displayOrder: 2 } });
  assert.equal(good.statusCode, 201);
  assert.equal(good.body.data.published, false);
  const bad = await controllerCall(createTestimonial, { body: { customerName: "A", reviewText: "x", rating: 7 } });
  assert.equal(bad.statusCode, 400);
});

test("authorized controller operations update and delete records", async () => {
  Testimonial.findById = async () => ({ ...records[0], toObject() { return { ...records[0] }; }, async save() { return this; } });
  Testimonial.findByIdAndDelete = async () => records[0];
  const updated = await controllerCall(updateTestimonial, { params: { id }, body: { published: false } });
  assert.equal(updated.statusCode, 200);
  const deleted = await controllerCall(deleteTestimonial, { params: { id } });
  assert.equal(deleted.statusCode, 200);
});

test("auth middleware denies requests without a token", async () => {
  const res = response();
  let continued = false;
  await protect({ headers: {} }, res, () => { continued = true; });
  assert.equal(continued, false);
  assert.equal(res.statusCode, 401);
});

test("auth middleware accepts an active admin token", async () => {
  process.env.JWT_SECRET = "unit-test-secret";
  Admin.findById = async () => ({ active: true, role: "admin" });
  const req = { headers: { authorization: `Bearer ${jwt.sign({ id }, process.env.JWT_SECRET)}` } };
  const res = response();
  let continued = false;
  await protect(req, res, () => { continued = true; });
  assert.equal(continued, true);
  assert.equal(req.admin.active, true);
});
