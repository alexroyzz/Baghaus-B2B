import test from "node:test";
import assert from "node:assert/strict";
import Inquiry from "../models/Inquiry.js";
import { createInquiry } from "../controllers/inquiryController.js";

const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } });
const call = async (body) => {
  const res = response(); let error;
  await createInquiry({ body }, res, (err) => { error = err; });
  if (error) throw error;
  return res;
};

test("contact and quote inquiry fields are accepted and trimmed", async () => {
  Inquiry.create = async (record) => record;
  const res = await call({ type: "contact", name: "  Buyer Name ", company: " Shop ", email: " buyer@example.com ", phone: " +1 555 0100 ", country: " US ", quantity: " 100 ", message: " Need pricing " });
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.data.name, "Buyer Name");
  assert.equal(res.body.data.email, "buyer@example.com");
  assert.equal(res.body.data.message, "Need pricing");
  const quote = await call({ type: "quote", name: "Buyer Name", email: "buyer@example.com", phone: "5550100", product: "64b000000000000000000001", productName: "Tote Bag", quantity: "100", message: "Please quote" });
  assert.equal(quote.statusCode, 201);
  assert.equal(quote.body.data.product, "64b000000000000000000001");
});

test("WhatsApp click logging continues to accept the site-generated record", async () => {
  Inquiry.create = async (record) => record;
  const res = await call({ type: "whatsapp", name: "WhatsApp Click", email: "not-provided@baghaus.lead", phone: "not-provided", productName: "Canvas Tote", message: "Interested in wholesale bags", source: "whatsapp-button" });
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.data.source, "whatsapp-button");
  assert.equal(res.body.data.productName, "Canvas Tote");
});

test("invalid and oversized enquiry details are rejected", async () => {
  const missing = await call({ name: "A", email: "not-an-email", phone: "1" });
  assert.equal(missing.statusCode, 400);
  const oversized = await call({ name: "Buyer Name", email: "buyer@example.com", phone: "12345", message: "x".repeat(4001) });
  assert.equal(oversized.statusCode, 400);
});
