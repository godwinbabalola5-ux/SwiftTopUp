const jwt = require("jsonwebtoken");
const { query } = require("../config/db");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {

    try {

        const {
            fullname,
            email,
            phone,
            password,
            referralCode
        } = req.body;

        if (!fullname || !email || !phone || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        query(
            "SELECT * FROM users WHERE email=? OR phone=?",
            [email, phone],
            async (err, results) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                if (results.length > 0) {

                    if (results[0].email === email) {

                        return res.status(400).json({
                            success: false,
                            message: "Email already exists."
                        });

                    }

                    if (results[0].phone === phone) {

                        return res.status(400).json({
                            success: false,
                            message: "Phone already exists."
                        });

                    }

                }

                let referredBy = null;

                if (referralCode && referralCode.trim() !== "") {

                    query(
                        "SELECT * FROM users WHERE referral_code=?",
                        [referralCode],
                        async (err, referralResults) => {

                            if (err) {

                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });

                            }

                            if (referralResults.length === 0) {

                                return res.status(400).json({
                                    success: false,
                                    message: "Invalid referral code."
                                });

                            }

                            referredBy = referralResults[0].id;

                            createUser(referredBy);

                        }
                    );

                } else {

                    createUser(null);

                }

                async function createUser(referredBy) {

                    const hashedPassword = await bcrypt.hash(password, 10);

                    const newReferralCode =
                        "ST" +
                        Math.random()
                            .toString(36)
                            .substring(2, 8)
                            .toUpperCase();

                    query(
                        `INSERT INTO users
                        (fullname,email,phone,password,referral_code,referred_by)
                        VALUES(?,?,?,?,?,?)`,
                        [
                            fullname,
                            email,
                            phone,
                            hashedPassword,
                            newReferralCode,
                            referredBy
                        ],
                        (err, result) => {

                            if (err) {

                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });

                            }

                            const newUserId = result.insertId;

                            if (referredBy) {

                                query(
    `UPDATE users
     SET
        wallet = wallet + 200,
        referral_bonus = referral_bonus + 200,
        total_referrals = total_referrals + 1
     WHERE id=?`,
    [referredBy],
    (err) => {

        if(err){
            console.log("Referral update error:", err);
        }else{
            console.log("Referral bonus added.");
        }

    }
);

                                query(
                                    "INSERT INTO referrals(referrer_id,referred_user_id,bonus) VALUES(?,?,200)",
                                    [referredBy, newUserId]
                                );

                                query(
                                    "INSERT INTO notifications(user_id,title,message) VALUES(?,?,?)",
                                    [
                                        referredBy,
                                        "Referral Bonus",
                                        "Congratulations! You earned ₦200 referral bonus."
                                    ]
                                );

                            }

                            res.status(201).json({
                                success: true,
                                message: "Registration Successful!"
                            });

                        }
                    );

                }

            }

        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const loginUser = (req, res) => {

    const { email, password } = req.body;

    query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "User not found."
                });

            }

            const user = results[0];

            const validPassword = await bcrypt.compare(
                password,
                user.password
            );

            if (!validPassword) {

                return res.status(401).json({
                    success: false,
                    message: "Incorrect password."
                });

            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            res.json({
                success: true,
                message: "Login Successful!",
                token
            });

        }

    );

};

module.exports = {
    registerUser,
    loginUser
};