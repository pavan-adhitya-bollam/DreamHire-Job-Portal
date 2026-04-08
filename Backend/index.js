// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import authRoute from "./routes/otp.route.js";
import adminRoute from "./routes/admin.route.js";
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://127.0.0.1:60873",
    "http://172.27.240.1:5173", 
    "http://172.27.240.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:64425",
    "http://127.0.0.1:53554",
    "https://dream-hire-job-portal.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
};

app.use(cors(corsOptions));

// Serve static files from uploads folder
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5001;

 
//api's

app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
