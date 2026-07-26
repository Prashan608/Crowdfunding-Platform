import express from "express";
import { createDonation } from "../controllers/donation.controller.js";
import { createDonationValidation } from "../validators/donation.validator.js";
import validate from "../middlewares/validation.middleware.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/:campaignId",
  isAuthenticated,
  authorizeRoles("supporter"),
  createDonationValidation,
  validate,
  createDonation
);

export default router;