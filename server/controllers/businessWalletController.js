const db = require("../config/db");

// ==========================================
// GET BUSINESS WALLET
// ==========================================

const getBusinessWallet = async (req, res) => {

    try {

        const [wallet] = await db.query(`
            SELECT
                balance,
                total_profit,
                total_withdrawn,
                updated_at
            FROM business_wallet
            WHERE id = 1
            LIMIT 1
        `);

        if (wallet.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Business wallet not found."
            });

        }

        res.json({
            success: true,
            wallet: wallet[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    getBusinessWallet
};