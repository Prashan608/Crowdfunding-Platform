import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";

import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getPaymentById,
  getCampaignDonations,
  handleFailedPayment,
  razorpayWebhook,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Create Razorpay Order
router.post("/create-order", isAuthenticated, createOrder);

// Verify Razorpay Payment
router.post("/verify", isAuthenticated, verifyPayment);

// Payment History
router.get("/history", isAuthenticated, getPaymentHistory);

// Campaign Donations
// Important: keep this before "/:id"
router.get(
  "/campaign/:campaignId/donations",
  isAuthenticated,
  getCampaignDonations
);

// Single Payment
// Keep dynamic route after specific routes
router.get("/:id", isAuthenticated, getPaymentById);

// Failed Payment
router.post("/failure", isAuthenticated, handleFailedPayment);

// Razorpay Webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

export default router;