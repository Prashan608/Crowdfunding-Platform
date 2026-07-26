import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  changePasswordValidation,
  updateProfileValidation,
} from "../validators/profile.validator.js";
import {
  changePassword,
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getProfile);

router.put(
  "/",
  isAuthenticated,
  updateProfileValidation,
  validate,
  updateProfile
);

router.put(
  "/change-password",
  isAuthenticated,
  changePasswordValidation,
  validate,
  changePassword
);

export default router;