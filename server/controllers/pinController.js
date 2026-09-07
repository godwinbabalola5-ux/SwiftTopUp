const bcrypt = require("bcrypt");
const db = require("../config/db");

// A transaction PIN is separate from the login password on purpose —
// it's the second check that protects your wallet specifically, so
// someone who unlocks your phone (or catches your password) still
// can't drain your wallet without also knowing this.

const isValidPin = (pin) =>
    typeof pin === "string" && /^\d{4}$/.test(pin);


// ==========================================
// CHECK PIN STATUS
// ==========================================
// Frontend uses this to decide whether to show "set your PIN first"
// instead of a normal PIN-entry prompt before a purchase.

const getPinStatus = async (req, res) => {

    try {

        const userId = req.user.id;

        const [users] = await db.query(
            "SELECT transaction_pin FROM users WHERE id = ?",
            [userId]
        );

        const hasPin = Boolean(users[0]?.transaction_pin);

        return res.json({
            success: true,
            hasPin
        });

    } catch (error) {

        console.log("GET PIN STATUS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to check PIN status."
        });

    }

};


// ==========================================
// SET PIN (first time only)
// ==========================================

const setPin = async (req, res) => {

    try {

        const userId = req.user.id;
        const { pin, confirmPin } = req.body;

        if (!isValidPin(pin)) {
            return res.status(400).json({
                success: false,
                message: "PIN must be exactly 4 digits."
            });
        }

        if (pin !== confirmPin) {
            return res.status(400).json({
                success: false,
                message: "PINs do not match."
            });
        }

        const [users] = await db.query(
            "SELECT transaction_pin FROM users WHERE id = ?",
            [userId]
        );

        if (users[0]?.transaction_pin) {
            return res.status(400).json({
                success: false,
                message: "A PIN is already set. Use \"Change PIN\" instead."
            });
        }

        const hashedPin = await bcrypt.hash(pin, 10);

        await db.query(
            "UPDATE users SET transaction_pin = ? WHERE id = ?",
            [hashedPin, userId]
        );

        return res.json({
            success: true,
            message: "Transaction PIN set successfully."
        });

    } catch (error) {

        console.log("SET PIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to set PIN."
        });

    }

};


// ==========================================
// CHANGE PIN (requires the current one)
// ==========================================

const changePin = async (req, res) => {

    try {

        const userId = req.user.id;
        const { currentPin, newPin, confirmNewPin } = req.body;

        if (!isValidPin(newPin)) {
            return res.status(400).json({
                success: false,
                message: "New PIN must be exactly 4 digits."
            });
        }

        if (newPin !== confirmNewPin) {
            return res.status(400).json({
                success: false,
                message: "New PINs do not match."
            });
        }

        const [users] = await db.query(
            "SELECT transaction_pin FROM users WHERE id = ?",
            [userId]
        );

        const existingHash = users[0]?.transaction_pin;

        if (!existingHash) {
            return res.status(400).json({
                success: false,
                message: "No PIN set yet. Use \"Set PIN\" instead."
            });
        }

        const validCurrentPin = await bcrypt.compare(
            String(currentPin || ""),
            existingHash
        );

        if (!validCurrentPin) {
            // Same reasoning as requireTransactionPin.js — 400, not 401,
            // so the frontend doesn't treat a wrong PIN as a dead login
            // session and clear the auth token.
            return res.status(400).json({
                success: false,
                message: "Current PIN is incorrect."
            });
        }

        const hashedPin = await bcrypt.hash(newPin, 10);

        await db.query(
            "UPDATE users SET transaction_pin = ? WHERE id = ?",
            [hashedPin, userId]
        );

        return res.json({
            success: true,
            message: "Transaction PIN changed successfully."
        });

    } catch (error) {

        console.log("CHANGE PIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to change PIN."
        });

    }

};


module.exports = {
    getPinStatus,
    setPin,
    changePin
};
