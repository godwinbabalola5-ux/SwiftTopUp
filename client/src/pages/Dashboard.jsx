import { useContext } from "react";
import { Link } from "react-router-dom";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import WelcomeHero from "../components/dashboard/WelcomeHero";
import WelcomeSlider from "../components/dashboard/WelcomeSlider";
import LiveTicker from "../components/dashboard/LiveTicker";
import Sidebar from "../components/layout/Sidebar";
import DashboardHeader from "../components/layout/DashboardHeader";
import WalletCard from "../components/cards/WalletCard";
import Loader from "../components/ui/Loader";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

function Dashboard() {

    const { user, loading } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);

    if (loading) {
        return <Loader />;
    }

    return (

        <div className={`flex min-h-screen ${
            darkMode
                ? "bg-gray-900"
                : "bg-gray-100"
        }`}>

            <Sidebar />

            <div className="flex-1 p-8">

                <DashboardHeader user={user} />
                <LiveTicker />
                <WelcomeHero user={user} />
                <WelcomeSlider />
                <WalletCard balance={user?.wallet} />
                <DashboardOverview />

                <AnalyticsChart />

                <div className="mt-12">

    <div className="flex justify-between items-center mb-6">

        <div>

            <h2 className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
            }`}>
                Quick Actions
            </h2>

            <p className={`mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
                Everything you need in one place
            </p>

        </div>

    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <Link
            to="/fund-wallet"
            className="group bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-300"
        >
            <div className="text-5xl">💳</div>
            <h3 className="font-bold text-xl mt-4">
                Fund Wallet
            </h3>
            <p className="text-blue-100 text-sm mt-2">
                Add money instantly
            </p>
        </Link>

        <Link
            to="/airtime"
            className="group bg-gradient-to-br from-green-500 to-green-700 text-white rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-300"
        >
            <div className="text-5xl">📱</div>
            <h3 className="font-bold text-xl mt-4">
                Airtime
            </h3>
            <p className="text-green-100 text-sm mt-2">
                Recharge any network
            </p>
        </Link>

        <Link
            to="/data"
            className="group bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-300"
        >
            <div className="text-5xl">🌐</div>
            <h3 className="font-bold text-xl mt-4">
                Data
            </h3>
            <p className="text-purple-100 text-sm mt-2">
                Buy internet bundles
            </p>
        </Link>

        <Link
            to="/electricity"
            className="group bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-300"
        >
            <div className="text-5xl">⚡</div>
            <h3 className="font-bold text-xl mt-4">
                Electricity
            </h3>
            <p className="text-yellow-100 text-sm mt-2">
                Pay electricity bills
            </p>
        </Link>

        <Link
            to="/cable"
            className="group bg-gradient-to-br from-pink-600 to-red-600 text-white rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-300"
        >
            <div className="text-5xl">📺</div>
            <h3 className="font-bold text-xl mt-4">
                Cable TV
            </h3>
            <p className="text-pink-100 text-sm mt-2">
                Renew subscriptions
            </p>
        </Link>

        <Link
            to="/transactions"
            className="group bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-300"
        >
            <div className="text-5xl">📄</div>
            <h3 className="font-bold text-xl mt-4">
                Transactions
            </h3>
            <p className="text-cyan-100 text-sm mt-2">
                View transaction history
            </p>
        </Link>

        <Link
            to="/notifications"
            className="group bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-300"
        >
            <div className="text-5xl">🔔</div>
            <h3 className="font-bold text-xl mt-4">
                Notifications
            </h3>
            <p className="text-indigo-100 text-sm mt-2">
                Latest account updates
            </p>
        </Link>

        <Link
            to="/support"
            className="group bg-gradient-to-br from-gray-700 to-black text-white rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-300"
        >
            <div className="text-5xl">💬</div>
            <h3 className="font-bold text-xl mt-4">
                Support
            </h3>
            <p className="text-gray-300 text-sm mt-2">
                We're here to help
            </p>
        </Link>

    </div>

</div>
            </div>

        </div>

    );

}

export default Dashboard;