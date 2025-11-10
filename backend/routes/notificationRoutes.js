import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationControllers.js";

const router = express.Router();

router.route("/").get(protect, getNotifications);
router.route("/mark-read").post(protect, markAsRead);

export default router;
