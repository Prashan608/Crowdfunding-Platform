import express from "express";
import {
  getAdminDashboard,
  getCreatorDashboard,
  getSupporterDashboard,
} from "../controllers/dashbord.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/admin",
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminDashboard
);

router.get(
  "/creator",
  isAuthenticated,
  authorizeRoles("creator"),
  getCreatorDashboard
);
router.get(
  "/supporter",
  isAuthenticated,
  authorizeRoles("supporter"),
  getSupporterDashboard
);
export default router;