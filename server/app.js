require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

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
const walletRoutes = require("./routes/walletRoutes");
const airtimeRoutes = require("./routes/airtimeRoutes");
const dataRoutes = require("./routes/dataRoutes");
const electricityRoutes = require("./routes/electricityRoutes");
const cableRoutes = require("./routes/cableRoutes");
const vtpassRoutes = require("./routes/vtpassRoutes");
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

// ==========================
// API Endpoints
// ==========================
app.use("/api/users", userRoutes);

console.log("✅ User routes loaded");

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
app.use("/api/vtpass", vtpassRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recent-transactions", recentTransactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/cashback", cashbackRoutes);

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