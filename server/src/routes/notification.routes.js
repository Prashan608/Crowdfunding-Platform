import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";

import {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Get All Notifications
router.get(
  "/",
  isAuthenticated,
  getNotifications
);

// Get Notification By Id
router.get(
  "/:id",
  isAuthenticated,
  getNotificationById
);

// Mark Notification As Read
router.patch(
  "/:id/read",
  isAuthenticated,
  markAsRead
);

// Mark All Notifications As Read
router.patch(
  "/read-all",
  isAuthenticated,
  markAllAsRead
);

// Delete Notification
router.delete(
  "/:id",
  isAuthenticated,
  deleteNotification
);

export default router;