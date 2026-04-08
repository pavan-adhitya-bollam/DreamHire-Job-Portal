import express from "express";
import { singleUpload, resumeUpload } from "../middleware/multer.js";

import authenticateToken from "../middleware/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, sendApplicationEmail } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/apply/:jobId", authenticateToken, resumeUpload, applyJob);
router.post("/apply", sendApplicationEmail);
router.get("/get", authenticateToken, getAppliedJobs);
router.get("/:id/applicants", authenticateToken, getApplicants);
router.post("/status/:id/update", authenticateToken, updateStatus);

export default router;
