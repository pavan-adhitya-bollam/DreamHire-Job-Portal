import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    console.log("=== AUTH DEBUG START ===");
    console.log("Request headers:", req.headers);
    console.log("Request cookies:", req.cookies);
    console.log("Cookie header:", req.headers.cookie);
    
    const token = req.cookies.token;
    console.log("Token from cookies:", token);
    
    if (!token) {
      console.log("No token found in cookies");
      return res
        .status(401)
        .json({ message: "No token provided", success: false });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Token verification failed - invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }
    
    req.id = decoded.userId;
    console.log("=== AUTH SUCCESS ===");
    console.log("Token verified successfully");
    console.log("User ID set to:", req.id);
    console.log("Decoded token:", decoded);
    next();
  } catch (error) {
    console.log("=== AUTH ERROR ===");
    console.log("Token verification failed:", error.message);
    console.log("Request cookies:", req.cookies);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticateToken;