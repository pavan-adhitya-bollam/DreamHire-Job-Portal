import express from "express";
import {
  adminLogin,
  adminLogout,
  getAllApplications,
  acceptApplication,
  rejectApplication,
  getApplicationStats,
} from "../controllers/admin.controller.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Admin Login (no authentication required)
router.post("/login", adminLogin);

// Admin Logout
router.post("/logout", adminLogout);

// Get all applications (admin authentication required)
router.get("/applications", authenticateAdmin, getAllApplications);

// Get application statistics (admin authentication required)
router.get("/stats", authenticateAdmin, getApplicationStats);

// Accept application (admin authentication required)
router.put("/applications/:id/accept", authenticateAdmin, acceptApplication);

// Reject application (admin authentication required)
router.put("/applications/:id/reject", authenticateAdmin, rejectApplication);

export default router;
