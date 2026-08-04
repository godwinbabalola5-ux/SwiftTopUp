const db = require("../config/db");

// ======================
// Get Settings
// ======================
const getSettings = (req, res) => {

    db.query(
        "SELECT * FROM settings LIMIT 1",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                settings: result[0]
            });

        }
    );

};

// ======================
// Update Settings
// ======================
const updateSettings = (req, res) => {

    const {

        company_name,
        support_email,
        support_phone,
        minimum_funding,
        maximum_funding,
        airtime_enabled,
        data_enabled,
        cable_enabled,
        electricity_enabled,
        maintenance_mode

    } = req.body;

    db.query(

        `UPDATE settings SET

        company_name=?,
        support_email=?,
        support_phone=?,
        minimum_funding=?,
        maximum_funding=?,
        airtime_enabled=?,
        data_enabled=?,
        cable_enabled=?,
        electricity_enabled=?,
        maintenance_mode=?

        WHERE id=1`,

        [

            company_name,
            support_email,
            support_phone,
            minimum_funding,
            maximum_funding,
            airtime_enabled,
            data_enabled,
            cable_enabled,
            electricity_enabled,
            maintenance_mode

        ],

        (err) => {

            if (err) {

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }

            res.json({

                success:true,
                message:"Settings updated successfully."

            });

        }

    );

};

module.exports = {

    getSettings,
    updateSettings

};