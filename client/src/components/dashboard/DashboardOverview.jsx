import { useEffect, useState } from "react";
import api from "../../services/api";
import {
    FaWallet,
    FaExchangeAlt,
    FaMoneyBillWave,
    FaGift
} from "react-icons/fa";

function DashboardOverview() {

    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/analytics", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAnalytics(response.data.analytics);

        } catch (err) {
            console.log(err);
        }

    };

    if (!analytics) return null;

    const cards = [

        {
            title: "Wallet Balance",
            value: `₦${Number(analytics.wallet).toLocaleString()}`,
            icon: <FaWallet size={26} />,
            color: "from-blue-600 to-indigo-700"
        },

        {
            title: "My Transactions",
            value: analytics.totalTransactions,
            icon: <FaExchangeAlt size={26} />,
            color: "from-purple-600 to-pink-600"
        },

        {
            title: "Today's Spending",
            value: `₦${Number(analytics.totalSpent).toLocaleString()}`,
            icon: <FaMoneyBillWave size={26} />,
            color: "from-red-500 to-red-700"
        },

        {
            title: "Referral Earnings",
            value: `₦${Number(analytics.referralBonus || 0).toLocaleString()}`,
            icon: <FaGift size={26} />,
            color: "from-green-500 to-green-700"
        }

    ];

    return (

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-8">

            {cards.map((card, index) => (

                <div
                    key={index}
                    className={`bg-gradient-to-r ${card.color} rounded-3xl text-white p-6 shadow-xl hover:scale-105 transition duration-300`}
                >

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-white/80">
                                {card.title}
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {card.value}
                            </h2>

                        </div>

                        <div className="bg-white/20 p-4 rounded-full">
                            {card.icon}
                        </div>

                    </div>

                </div>

            ))}

        </div>

    );

}

export default DashboardOverview;