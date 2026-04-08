import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import path from "path";
import fs from "fs";

// Fix existing profile photos in database
async function fixProfilePhotos() {
  try {
    await mongoose.connect("mongodb://localhost:27017/job-portal");
    console.log("Connected to MongoDB");

    const users = await User.find({ "profile.profilePhoto": { $exists: true, $ne: "" } });
    console.log(`Found ${users.length} users with profile photos`);

    for (const user of users) {
      const currentPhoto = user.profile.profilePhoto;
      console.log(`User: ${user.email}, Current photo: ${currentPhoto}`);

      // If photo path is full system path, convert to web path
      if (currentPhoto && currentPhoto.includes("\\")) {
        const filename = path.basename(currentPhoto);
        const newPhotoPath = `/uploads/${filename}`;
        
        console.log(`Converting: ${currentPhoto} -> ${newPhotoPath}`);
        
        // Check if file exists in uploads folder
        const uploadPath = path.join(process.cwd(), "uploads", filename);
        if (fs.existsSync(uploadPath)) {
          user.profile.profilePhoto = newPhotoPath;
          await user.save();
          console.log(`✅ Updated ${user.email}`);
        } else {
          console.log(`❌ File not found: ${uploadPath}`);
        }
      }
    }

    console.log("Profile photo fix completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixProfilePhotos();
