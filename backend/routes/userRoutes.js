import express from "express";
import {
  authUser,
  registerUser,
  allUsers,
  logoutUser,
  getMe,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

export default router;
