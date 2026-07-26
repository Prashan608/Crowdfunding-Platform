import { body } from "express-validator";

export const createDonationValidation = [
  body("amount")
    .notEmpty()
    .withMessage("Donation amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Donation amount must be greater than 0"),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters"),
];