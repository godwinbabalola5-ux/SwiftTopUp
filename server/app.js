require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);

// ==========================
// Security headers
// ==========================
// helmet sets a batch of HTTP headers (X-Content-Type-Options,
// X-Frame-Options, etc.) that stop a handful of common attacks —
// clickjacking, MIME-sniffing, etc. Safe defaults for a JSON API.
app.use(helmet());

// ==========================
// Rate limiting
// ==========================
// Without this, nothing stops someone from hammering your endpoints —
// e.g. brute-forcing login passwords, or spamming buy-airtime requests
// to see if they can find another way around the wallet check.

// General limiter — applies to every /api/ route as a baseline.
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,                 // 300 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again shortly."
    }
});

// Stricter limiter for login/register — these are the classic
// brute-force targets, so they get a much tighter cap.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // 10 attempts per IP per 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again later."
    }
});

// Stricter limiter for anything that spends money — buying airtime,
// data, electricity, cable, or funding the wallet. Slower than a
// normal browsing pace, but well above what a real user needs.
const paymentLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many purchase attempts. Please slow down and try again shortly."
    }
});

app.use("/api", generalLimiter);

// ==========================
// Middleware
// ==========================
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map(url => url.trim())
    : [
        "http://localhost:5173",
        "http://localhost:5175",
        "http://localhost:5176"
    ];

app.use(cors({
    origin(origin, callback) {

        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));

    },
    credentials: true
}));

app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// ==========================
// Socket.IO
// ==========================
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

app.set("io", io);

io.on("connection", (socket) => {

    console.log("🟢 User Connected:", socket.id);

    socket.on("join", (userId) => {

        socket.join(`user_${userId}`);

        console.log(`✅ User ${userId} joined room user_${userId}`);

    });

    socket.on("disconnect", () => {

        console.log("🔴 User Disconnected:", socket.id);

    });

});

// ==========================
// Routes
// ==========================
const userRoutes = require("./routes/userRoutes");
const revenueRoutes = require("./routes/revenueRoutes");
const walletRoutes = require("./routes/walletRoutes");
const airtimeRoutes = require("./routes/airtimeRoutes");
const dataRoutes = require("./routes/dataRoutes");
const electricityRoutes = require("./routes/electricityRoutes");
const cableRoutes = require("./routes/cableRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const profileRoutes = require("./routes/profileRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const dashboardAnalyticsRoutes = require("./routes/dashboardAnalyticsRoutes");
const recentTransactionRoutes = require("./routes/recentTransactionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminWalletRoutes = require("./routes/adminWalletRoutes");
const adminRefundRoutes = require("./routes/adminRefundRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const referralRoutes = require("./routes/referralRoutes");
const cashbackRoutes = require("./routes/cashbackRoutes");
const businessWalletRoutes = require("./routes/businessWalletRoutes");
const businessWithdrawalRoutes = require("./routes/businessWithdrawalRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");


// ==========================
// API Endpoints
// ==========================

// Stricter limiters applied to specific route prefixes BEFORE the
// general routers below handle them — order matters in Express,
// this has to come first so the limiter actually runs.
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

app.use("/api/airtime", paymentLimiter);
app.use("/api/data", paymentLimiter);
app.use("/api/electricity", paymentLimiter);
app.use("/api/cable", paymentLimiter);
app.use("/api/payment", paymentLimiter);

app.use("/api/users", userRoutes);

console.log("✅ User routes loaded");
app.use("/api/revenue", revenueRoutes);
app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "API is working"
    });

});

app.use("/api/wallet", walletRoutes);
app.use("/api/airtime", airtimeRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/electricity", electricityRoutes);
app.use("/api/cable", cableRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recent-transactions", recentTransactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/cashback", cashbackRoutes);
app.use("/api/business-wallet", businessWalletRoutes);
app.use("/api/business-withdrawals", businessWithdrawalRoutes);

// ==========================
// Analytics
// ==========================
app.use("/api/dashboard-analytics", dashboardAnalyticsRoutes);
app.use("/api/analytics", analyticsRoutes);

// ==========================
// Admin
// ==========================
app.use("/api/admin", adminRoutes);
app.use("/api/admin/wallet", adminWalletRoutes);
app.use("/api/admin/refunds", adminRefundRoutes);

// ==========================
// Home
// ==========================
app.get("/", (req, res) => {

    res.send("🚀 Welcome to SwiftTopUp Backend!");

});

const listEndpoints = require("express-list-endpoints");

console.log(listEndpoints(app));

// ==========================
// Start Server
// ==========================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log(`📡 Allowed frontend origins: ${allowedOrigins.join(", ")}`);

});