const { query } = require("../config/db");

const getAnalytics = (req, res) => {

    const userId = req.user.id;

    const analytics = {

        wallet: 0,

        totalTransactions: 0,

        airtime: 0,

        data: 0,

        electricity: 0,

        cable: 0,

        totalSpent: 0

    };

    query(

        "SELECT wallet FROM users WHERE id=?",

        [userId],

        (err, walletResult) => {

            if (err) {

                return res.status(500).json({

                    success:false,

                    message:err.message

                });

            }

            analytics.wallet = Number(walletResult[0]?.wallet || 0);

            query(

                "SELECT COUNT(*) total FROM transactions WHERE user_id=?",

                [userId],

                (err,totalResult)=>{

                    if(err){

                        return res.status(500).json({

                            success:false,

                            message:err.message

                        });

                    }

                    analytics.totalTransactions = totalResult[0].total;

                    query(

                        "SELECT type,SUM(amount) amount,COUNT(*) total FROM transactions WHERE user_id=? GROUP BY type",

                        [userId],

                        (err,typeResult)=>{

                            if(err){

                                return res.status(500).json({

                                    success:false,

                                    message:err.message

                                });

                            }

                            typeResult.forEach(item=>{

                                analytics.totalSpent += Number(item.amount);

                                analytics[item.type]=item.total;

                            });

                            res.json({

                                success:true,

                                analytics

                            });

                        }

                    );

                }

            );

        }

    );

};

module.exports={

    getAnalytics

};