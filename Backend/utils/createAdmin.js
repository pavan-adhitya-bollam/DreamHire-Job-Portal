import bcrypt from "bcryptjs";
import { Admin } from "../models/admin.model.js";

// Create default admin account (run once)
export const createDefaultAdmin = async () => {
  try {
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
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};
