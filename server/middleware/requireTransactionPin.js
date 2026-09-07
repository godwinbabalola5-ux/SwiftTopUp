const bcrypt = require("bcrypt");
const db = require("../config/db");

// Applied to the four purchase routes (airtime/data/electricity/cable)
// AFTER auth but BEFORE the controller runs — so a stolen/leaked login
// token alone isn't enough to spend the wallet, the request also has
// to include the correct 4-digit PIN.
//
// Note: this sits behind the same paymentLimiter rate limiter already
// applied to these routes in app.js (20 requests / 5 min per IP), which
// also happens to throttle PIN brute-forcing — a 4-digit PIN only has
// 10,000 combinations, so without SOME rate limit it'd be guessable
// quickly. The existing purchase rate limit already covers this.

const requireTransactionPin = async (req, res, next) => {

    try {

        const userId = req.user.id;
        const { pin } = req.body;

        const [users] = await db.query(
            "SELECT transaction_pin FROM users WHERE id = ?",
            [userId]
        );

        const storedHash = users[0]?.transaction_pin;

        if (!storedHash) {
            // Distinct error so the frontend can redirect to "set your
            // PIN first" instead of just showing a generic failure.
            return res.status(403).json({
                success: false,
                pinRequired: true,
                message: "Please set a transaction PIN before making purchases."
            });
        }

        if (!pin) {
            return res.status(400).json({
                success: false,
                message: "Transaction PIN is required."
            });
        }

        const validPin = await bcrypt.compare(String(pin), storedHash);

        if (!validPin) {
            // 400, not 401 — this is a wrong PIN, not an invalid login
            // session. The frontend's axios interceptor treats every 401
            // as "log the user out and clear their token," so using 401
            // here was silently logging people out the moment they
            // mistyped their PIN, which is why the next request failed
            // with "No token provided."
            return res.status(400).json({
                success: false,
                message: "Incorrect transaction PIN."
            });
        }

        next();

    } catch (error) {

        console.log("PIN VERIFICATION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify transaction PIN."
        });

    }

};

module.exports = requireTransactionPin;
