import multer from "multer";
import path from "path";

// Configure disk storage for better file handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Create an uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter to accept both resume files and images
const fileFilter = (req, file, cb) => {
  // Allow PDF, DOC, DOCX for resumes
  const allowedDocTypes = /pdf|doc|docx/;
  // Allow common image formats for profile photos
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  
  const extname = allowedDocTypes.test(path.extname(file.originalname).toLowerCase()) || 
                 allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = allowedDocTypes.test(file.mimetype) || 
                  allowedImageTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, JPEG, JPG, PNG, GIF, and WEBP files are allowed'));
  }
};

export const singleUpload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single("file"); // Changed from "resume" to "file" to match frontend

// Separate middleware for application resume uploads
export const resumeUpload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single("resume"); // For application resume uploads
