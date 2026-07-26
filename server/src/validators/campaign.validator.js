import { body } from "express-validator";

export const createCampaignValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),

  body("goalAmount")
    .notEmpty()
    .withMessage("Goal amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Goal amount must be greater than 0"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "Education",
      "Medical",
      "Startup",
      "Charity",
      "Animal",
      "Environment",
      "Emergency",
      "Other",
    ])
    .withMessage("Invalid category"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date"),
];