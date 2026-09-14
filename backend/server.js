require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

connectDB();

app.use(
  helmet({
    crossOriginResourcePolicy: false, // allow images to be loaded cross-origin by the frontend
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// Serve uploaded images and static assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "uploads/images")));
app.use("/images", express.static(path.join(__dirname, "../frontend/public/images")));

app.get("/api/health", (req, res) => res.json({ success: true, message: "Rana Tour And Travels API is running." }));

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Global error handler (multer errors etc.)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[server] Rana Tour And Travels API listening on port ${PORT}`));
