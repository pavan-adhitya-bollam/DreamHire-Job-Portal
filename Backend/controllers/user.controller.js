import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAndSendOTP } from "../utils/emailService.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, adharcard, pancard, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role || !pancard || !adharcard) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const existingAdharcard = await User.findOne({ adharcard });
    if (existingAdharcard) {
      return res.status(400).json({
        message: "Adhar number already exists",
        success: false,
      });
    }

    const existingPancard = await User.findOne({ pancard });
    if (existingPancard) {
      return res.status(400).json({
        message: "Pan number already exists",
        success: false,
      });
    }

    const file = req.file;
    let profilePhotoUrl = "https://via.placeholder.com/150"; // default
    
    if (file) {
      console.log("File received:", file);
      // If it's an image file, use it as profile photo
      if (file.mimetype.startsWith('image/')) {
        profilePhotoUrl = `/uploads/${file.filename}`;
      }
    } else {
      console.log("No file received, using default profile photo");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      adharcard,
      pancard,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl, // Use the uploaded file URL or default
      },
    });

    await newUser.save();

    return res.status(201).json({
      message: `Account created successfully for ${fullname}`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error registering user",
      success: false,
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      console.log('Missing required fields:', { email: !!email, password: !!password, role: !!role });
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    console.log('User found:', user.email, 'Role:', user.role);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for email:', email);
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (user.role !== role) {
      console.log('Role mismatch. User role:', user.role, 'Requested role:', role);
      return res.status(403).json({
        message: "Invalid role",
        success: false,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Keep false for localhost development
      sameSite: 'lax', // Changed from 'none' to 'lax' for localhost
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      message: `Welcome back ${user.fullname}`,
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Login failed",
      success: false,
    });
  }
};

// ================= GET CURRENT USER =================
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
  try {
    // Clear the token cookie with same settings as login
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax', // Changed from 'none' to 'lax' to match login
    });
    
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Logout failed",
      success: false,
    });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    
    console.log("=== PROFILE UPDATE DEBUG ===");
    console.log("User ID:", userId);
    console.log("Request body:", { fullname, email, phoneNumber, bio, skills });
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    console.log("Current user:", user.email);
    console.log("New email:", email);
    console.log("Email comparison:", email !== user.email);

    // Update basic fields
    if (fullname) user.fullname = fullname;
    if (email && email !== user.email) {
      // Check if new email already exists (exclude current user)
      const existingUser = await User.findOne({ 
        email: email,
        _id: { $ne: userId } // Exclude current user
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Email already exists",
          success: false,
        });
      }
      user.email = email;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    
    // Update profile fields
    if (bio !== undefined) user.profile.bio = bio;
    if (skills) {
      // Handle skills - if it's a string, split by comma; if array, use as is
      const skillsArray = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;
      user.profile.skills = skillsArray;
    }
    
    // Update profile photo if file was uploaded
    if (req.file) {
      user.profile.profilePhoto = `/uploads/${req.file.filename}`;
      user.profile.profilePhotoOriginalname = req.file.originalname;
    }

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "Server error during profile update",
      success: false,
    });
  }
};

// ================= SEND OTP =================
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    // Check if email already exists and is verified
    const existingUser = await User.findOne({ email, isEmailVerified: true });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered and verified",
        success: false,
      });
    }

    // Generate and send OTP via email
    const otpData = await generateAndSendOTP(email);
    if (!otpData) {
      return res.status(500).json({
        message: "Failed to send OTP to email",
        success: false,
      });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Create temporary user record with OTP
      const tempSuffix = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      user = new User({
        email,
        emailVerificationOTP: otpData.otp,
        emailVerificationExpires: otpData.expiresAt,
        isEmailVerified: false,
        fullname: `temp_${tempSuffix}`, // Unique temporary values
        phoneNumber: `temp_${tempSuffix}`,
        password: `temp_${tempSuffix}`, // Will be updated later
        adharcard: `temp_${tempSuffix}`,
        pancard: `temp_${tempSuffix}`,
        role: 'Student',
      });
    } else {
      // Update existing user's OTP
      user.emailVerificationOTP = otpData.otp;
      user.emailVerificationExpires = otpData.expiresAt;
    }
    
    await user.save();

    console.log(`OTP sent successfully to ${email}: ${otpData.otp}`);

    // Return success response for production
    return res.status(200).json({
      message: "OTP sent to your email address",
      success: true,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({
      message: "Failed to send OTP",
      success: false,
    });
  }
};

// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if OTP is valid and not expired
    console.log("=== OTP VERIFICATION DEBUG ===");
    console.log("Email:", email);
    console.log("Received OTP:", otp);
    console.log("Received OTP type:", typeof otp);
    console.log("Stored OTP:", user.emailVerificationOTP);
    console.log("Stored OTP type:", typeof user.emailVerificationOTP);
    console.log("OTP match:", user.emailVerificationOTP === otp);
    console.log("OTP expires at:", user.emailVerificationExpires);
    console.log("Current time:", new Date());
    console.log("Is expired:", new Date() > user.emailVerificationExpires);
    console.log("================================");
    
    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    if (new Date() > user.emailVerificationExpires) {
      return res.status(400).json({
        message: "OTP has expired",
        success: false,
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      message: "Failed to verify OTP",
      success: false,
    });
  }
};

// ================= COMPLETE REGISTRATION =================
export const completeRegistration = async (req, res) => {
  try {
    const { email, fullname, phoneNumber, password, adharcard, pancard, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role || !pancard || !adharcard) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const file = req.file;
    let profilePhotoUrl = "https://via.placeholder.com/150";
    
    if (file && file.mimetype.startsWith('image/')) {
      profilePhotoUrl = `/uploads/${file.filename}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists (from OTP verification)
    console.log("=== COMPLETE REGISTRATION DEBUG ===");
    console.log("Email:", email);
    console.log("Looking for existing user...");
    
    let existingUser = await User.findOne({ email });
    console.log("Existing user found:", !!existingUser);
    if (existingUser) {
      console.log("Existing user ID:", existingUser._id);
      console.log("Existing user email verified:", existingUser.isEmailVerified);
      console.log("Existing user phone:", existingUser.phoneNumber);
      console.log("New phone:", phoneNumber);
    }
    console.log("====================================");
    
    // Check if phone number is already used by another user
    if (phoneNumber && phoneNumber !== 'temp') {
      const phoneUser = await User.findOne({ 
        phoneNumber: phoneNumber, 
        _id: { $ne: existingUser?._id } 
      });
      if (phoneUser) {
        return res.status(400).json({
          message: "Phone number is already registered with another account",
          success: false,
        });
      }
    }
    
    if (existingUser) {
      // Update existing user with complete information
      console.log("Updating existing user...");
      existingUser.fullname = fullname;
      if (phoneNumber && phoneNumber !== existingUser.phoneNumber) {
        existingUser.phoneNumber = phoneNumber;
      }
      existingUser.password = hashedPassword;
      existingUser.adharcard = adharcard;
      existingUser.pancard = pancard;
      existingUser.role = role;
      existingUser.profile = {
        profilePhoto: profilePhotoUrl,
      };
      existingUser.isEmailVerified = true;
      existingUser.emailVerificationOTP = undefined;
      existingUser.emailVerificationExpires = undefined;
      
      console.log("Saving updated user...");
      await existingUser.save();
      console.log("User saved successfully");
      
      // Generate JWT token and set cookie for automatic login
      const token = jwt.sign(
        { userId: existingUser._id, role: existingUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set authentication cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Keep false for localhost development
        sameSite: 'lax', // Changed from 'none' to 'lax' for localhost
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Return user data and success message
      return res.status(200).json({
        message: `Registration completed successfully for ${fullname}`,
        success: true,
        user: {
          _id: existingUser._id,
          fullname: existingUser.fullname,
          email: existingUser.email,
          phoneNumber: existingUser.phoneNumber,
          role: existingUser.role,
          profile: existingUser.profile
        }
      });
    } else {
      console.log("Creating new user...");
      // Create new user (fallback case)
      const newUser = new User({
        fullname,
        email,
        phoneNumber,
        adharcard,
        pancard,
        password: hashedPassword,
        role,
        profile: {
          profilePhoto: profilePhotoUrl,
        },
        isEmailVerified: true,
      });

      await newUser.save();
      console.log("New user created successfully");

      // Generate JWT token and set cookie for automatic login
      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set authentication cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Keep false for localhost development
        sameSite: 'lax', // Changed from 'none' to 'lax' for localhost
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Return user data and success message
      return res.status(201).json({
        message: `Registration completed successfully for ${fullname}`,
        success: true,
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
          profile: newUser.profile
        }
      });
    }
  } catch (error) {
    console.error("Complete registration error:", error);
    return res.status(500).json({
      message: "Server Error completing registration",
      success: false,
    });
  }
};