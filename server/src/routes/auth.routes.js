import express from "express";
import { registerUser, loginUser,forgotPassword,resetPassword } from "../controllers/auth.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,

} from "../validators/auth.validator.js";

import validate from "../middlewares/validation.middleware.js";


const router = express.Router();

router.post("/register", registerValidation, validate, registerUser);

router.post("/login", loginValidation, validate, loginUser);

router.get("/me", isAuthenticated, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Token Verified Successfully",
    user: req.user,
  });
});

router.post(
    "/forgot-password",
    forgotPasswordValidation,
    validate,
   forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPasswordValidation,
    validate,
    resetPassword
);

export default router;
