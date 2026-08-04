import { useEffect, useState } from "react";
import api from "../../services/api";
import StatsCard from "../cards/StatsCard";

function AnalyticsCards() {

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

    return (

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

            <StatsCard
                title="Wallet Balance"
                value={`₦${Number(analytics.wallet).toLocaleString()}`}
                icon="💰"
                color="text-green-600"
            />

            <StatsCard
                title="My Transactions"
                value={analytics.totalTransactions}
                icon="📄"
                color="text-blue-600"
            />

            <StatsCard
                title="Today's Spending"
                value={`₦${Number(analytics.totalSpent).toLocaleString()}`}
                icon="💸"
                color="text-red-500"
            />

            <StatsCard
                title="Referral Earnings"
                value={`₦${Number(analytics.referralBonus || 0).toLocaleString()}`}
                icon="🎁"
                color="text-purple-600"
            />

        </div>

    );

}

export default AnalyticsCards;