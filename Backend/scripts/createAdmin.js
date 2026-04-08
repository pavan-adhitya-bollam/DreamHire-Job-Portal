import bcrypt from "bcryptjs";
import { Admin } from "../models/admin.model.js";
import connectDB from "../utils/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create default admin account
const createDefaultAdmin = async () => {
  try {
    await connectDB();
    
    const existingAdmin = await Admin.findOne({ email: "admin@jobportal.com" });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      const admin = new Admin({
        name: "System Admin",
        email: "admin@jobportal.com",
        password: hashedPassword,
        role: "admin",
      });
      
      await admin.save();
      console.log("Default admin account created successfully");
      console.log("Email: admin@jobportal.com");
      console.log("Password: admin123");
    } else {
      console.log("Default admin account already exists");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating default admin:", error);
    process.exit(1);
  }
};

createDefaultAdmin();
