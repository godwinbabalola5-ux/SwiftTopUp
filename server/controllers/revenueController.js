const db = require("../config/db");

// ==========================================
// REVENUE SUMMARY
// ==========================================

const getRevenueSummary = (req, res) => {

    db.query(
        `
        SELECT

            IFNULL(SUM(provider_cost), 0) AS totalProviderCost,

            IFNULL(SUM(customer_amount), 0) AS totalCustomerAmount,

            IFNULL(SUM(profit), 0) AS totalProfit

        FROM business_revenue
        `,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({
                success: true,
                revenue: result[0]
            });

        }
    );

};


// ==========================================
// REVENUE BY SERVICE
// ==========================================

const getRevenueByService = (req, res) => {

    db.query(
        `
        SELECT

            service_type,

            COUNT(*) AS totalTransactions,

            IFNULL(SUM(provider_cost), 0) AS providerCost,

            IFNULL(SUM(customer_amount), 0) AS customerAmount,

            IFNULL(SUM(profit), 0) AS profit

        FROM business_revenue

        GROUP BY service_type

        ORDER BY profit DESC
        `,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({
                success: true,
                services: result
            });

        }
    );

};


// ==========================================
// RECENT REVENUE
// ==========================================

const getRecentRevenue = (req, res) => {

    db.query(
        `
        SELECT

            br.id,
            br.transaction_id,
            br.service_type,
            br.provider_cost,
            br.customer_amount,
            br.profit,
            br.reference,
            br.created_at,

            t.type,
            t.status,
            t.customer,

            u.fullname,
            u.email

        FROM business_revenue br

        LEFT JOIN transactions t
            ON br.transaction_id = t.id

        LEFT JOIN users u
            ON t.user_id = u.id

        ORDER BY br.created_at DESC

        LIMIT 50
        `,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({
                success: true,
                revenue: result
            });

        }
    );

};


module.exports = {

    getRevenueSummary,
    getRevenueByService,
    getRecentRevenue

};