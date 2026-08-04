const db = require("../config/db");

const getSettings = (req, res, next) => {

    db.query(
        "SELECT * FROM settings WHERE id = 1 LIMIT 1",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to load system settings."
                });
            }

            if (result.length === 0) {
                return res.status(500).json({
                    success: false,
                    message: "System settings not configured."
                });
            }

            req.settings = result[0];

            next();

        }
    );

};


// Check whether maintenance mode is active
const checkMaintenance = (req, res, next) => {

    if (req.settings?.maintenance_mode) {

        return res.status(503).json({
            success: false,
            message: "SwiftTopUp is currently under maintenance. Please try again later."
        });

    }

    next();

};


// Check whether a specific service is enabled
const checkService = (service) => {

    return (req, res, next) => {

        const enabled = req.settings?.[`${service}_enabled`];

        if (!enabled) {

            return res.status(503).json({
                success: false,
                message: `${service.charAt(0).toUpperCase() + service.slice(1)} service is currently unavailable.`
            });

        }

        next();

    };

};


module.exports = {
    getSettings,
    checkMaintenance,
    checkService
};