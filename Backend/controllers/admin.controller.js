import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Admin } from "../models/admin.model.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendApplicationStatusEmail } from "../utils/emailService.js";

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate admin JWT token
    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set admin cookie (separate from user cookie)
    console.log("=== ADMIN LOGIN COOKIE DEBUG ===");
    console.log("Setting adminToken cookie...");
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false, // Keep false for localhost development
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // Ensure cookie is available for all paths
    });
    console.log("AdminToken cookie set successfully");
    console.log("=== END ADMIN LOGIN COOKIE DEBUG ===");

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin Logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken");
    return res.status(200).json({
      success: true,
      message: "Admin logout successful",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All Applications with Job and User Details
export const getAllApplications = async (req, res) => {
  try {
    console.log("=== ADMIN GET APPLICATIONS DEBUG ===");
    
    // Get all applications
    const applications = await Application.find({}).sort({ createdAt: -1 });
    console.log(`Found ${applications.length} applications`);

    // Manually populate user and job data since fields are strings, not ObjectIds
    const populatedApplications = await Promise.all(
      applications.map(async (app) => {
        try {
          // Get user details
          const user = await User.findById(app.applicant);
          
          // Get job details - convert string job ID to ObjectId
          let job = null;
          if (app.job && mongoose.Types.ObjectId.isValid(app.job)) {
            try {
              job = await Job.findById(new mongoose.Types.ObjectId(app.job));
            } catch (jobError) {
              console.log(`Job not found for ID: ${app.job}`);
            }
          }
          
          return {
            _id: app._id,
            applicant: user ? {
              _id: user._id,
              fullname: user.fullname,
              email: user.email,
              phoneNumber: user.phoneNumber
            } : null,
            job: job ? {
              _id: job._id,
              title: job.title,
              company: job.company,
              location: job.location,
              salary: job.salary,
              type: job.type
            } : {
              // Show job ID as fallback when job details not found
              _id: app.job,
              title: 'Job Position',
              company: 'Company',
              location: 'Location',
              salary: 'Salary',
              type: 'Full-time'
            },
            resume: app.resume,
            status: app.status,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
          };
        } catch (error) {
          console.error(`Error populating application ${app._id}:`, error);
          return {
            _id: app._id,
            applicant: null,
            job: null,
            resume: app.resume,
            status: app.status,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
          };
        }
      })
    );

    console.log(`Successfully populated ${populatedApplications.length} applications`);
    console.log("=== END ADMIN GET APPLICATIONS DEBUG ===");

    return res.status(200).json({
      success: true,
      applications: populatedApplications,
    });
  } catch (error) {
    console.error("Get applications error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Accept Application
export const acceptApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Manually populate user and job data
    const user = await User.findById(application.applicant);
    const job = await Job.findById(application.job);

    const populatedApplication = {
      _id: application._id,
      applicant: user ? {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber
      } : null,
      job: job ? {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type
      } : null,
      resume: application.resume,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt
    };

    // Send acceptance email notification
    if (user && job) {
      await sendApplicationStatusEmail(
        user.email,
        user.fullname,
        job.title,
        job.company,
        "accepted"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Application accepted successfully",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("Accept application error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reject Application
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Manually populate user and job data
    const user = await User.findById(application.applicant);
    const job = await Job.findById(application.job);

    const populatedApplication = {
      _id: application._id,
      applicant: user ? {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber
      } : null,
      job: job ? {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type
      } : null,
      resume: application.resume,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt
    };

    // Send rejection email notification
    if (user && job) {
      await sendApplicationStatusEmail(
        user.email,
        user.fullname,
        job.title,
        job.company,
        "rejected"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Application rejected successfully",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("Reject application error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Application Stats
export const getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalApplications = await Application.countDocuments();

    return res.status(200).json({
      success: true,
      stats,
      totalApplications,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
