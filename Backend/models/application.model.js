import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: String,
      required: true,
    },

    applicant: {
      type: String,
      required: true,
    },

    // ✅ ADD THIS (VERY IMPORTANT)
    resume: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);