const { query } = require("../config/db");

// Generate referral code
const getReferral = (req, res) => {

    const userId = req.user.id;

    query(

        "SELECT referral_code FROM users WHERE id=?",

        [userId],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }

            res.json({

                success:true,

                code:result[0].referral_code

            });

        }

    );

};


// Referral statistics

const getReferralStats = (req,res)=>{

    const userId=req.user.id;

    query(

        `SELECT
        COUNT(*) AS total,
        SUM(reward) AS earnings
        FROM referrals
        WHERE referrer_id=?`,

        [userId],

        (err,result)=>{

            if(err){

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }

            res.json({

                success:true,

                stats:result[0]

            });

        }

    );

};

module.exports={

    getReferral,

    getReferralStats

};