import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import AdminCharts from "../components/admin/AdminCharts";
import socket from "../services/socket";
import AdminRevenue from "../components/admin/AdminRevenue";
import {
    FaUsers,
    FaWallet,
    FaMoneyBillWave,
    FaExchangeAlt,
    FaCalendarDay,
    FaCalendarAlt,
    FaChartLine
} from "react-icons/fa";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState({});
    const [analytics, setAnalytics] = useState([]);
    const [topServices, setTopServices] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [recentRevenue, setRecentRevenue] = useState([]);


    const [revenue, setRevenue] = useState({
        totalProviderCost: 0,
        totalCustomerAmount: 0,
        totalProfit: 0
    });

    useEffect(() => {

        loadDashboard();
        loadAnalytics();
        loadTopServices();
        loadActivityLogs();
        loadRevenue();
        loadRecentRevenue();

        socket.on("newTransaction", () => {

            loadDashboard();
            loadAnalytics();
            loadTopServices();
            loadActivityLogs();
            loadRevenue();
            loadRecentRevenue();

        });

        return () => {

            socket.off("newTransaction");

        };

    }, []);

    const getToken = () => {

        return localStorage.getItem("token");

    };

    const loadDashboard = async () => {

        try {

            const response = await api.get(
                "/admin/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setDashboard(response.data.dashboard);

        } catch (err) {

            console.log(err);

        }

    };

    const loadAnalytics = async () => {

        try {

            const response = await api.get(
                "/admin/analytics",
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setAnalytics(response.data.analytics);

        } catch (err) {

            console.log(err);

        }

    };

    const loadTopServices = async () => {

        try {

            const response = await api.get(
                "/admin/top-services",
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setTopServices(response.data.services);

        } catch (err) {

            console.log(err);

        }

    };

    const loadActivityLogs = async () => {

        try {

            const response = await api.get(
                "/admin/activity-logs",
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setActivityLogs(response.data.logs);

        } catch (err) {

            console.log(err);

        }

    };

    const loadRevenue = async () => {

        try {

            const response = await api.get(
                "/revenue/summary",
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setRevenue(response.data.revenue);

        } catch (err) {

            console.log("Revenue loading error:", err);

        }

    };
    const loadRecentRevenue = async () => {

    try {

        const response = await api.get(
            "/revenue/recent",
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );

        setRecentRevenue(response.data.revenue);

    } catch (err) {

        console.log(err);

    }

};

    const cards = [

        {
            title: "Total Users",
            value: dashboard.totalUsers,
            color: "bg-blue-600",
            icon: <FaUsers size={35} />
        },

        {
            title: "New Users Today",
            value: dashboard.newUsersToday,
            color: "bg-purple-600",
            icon: <FaUsers size={35} />
        },

        {
            title: "Wallet Balance",
            value: `₦${Number(
                dashboard.totalWallet || 0
            ).toLocaleString()}`,
            color: "bg-green-600",
            icon: <FaWallet size={35} />
        },

        {
            title: "Transactions",
            value: dashboard.totalTransactions,
            color: "bg-orange-600",
            icon: <FaExchangeAlt size={35} />
        },

        {
            title: "Funding",
            value: `₦${Number(
                dashboard.totalFunding || 0
            ).toLocaleString()}`,
            color: "bg-pink-600",
            icon: <FaMoneyBillWave size={35} />
        },

        {
            title: "Today's Revenue",
            value: `₦${Number(
                dashboard.todayRevenue || 0
            ).toLocaleString()}`,
            color: "bg-red-600",
            icon: <FaCalendarDay size={35} />
        },

        {
            title: "Monthly Revenue",
            value: `₦${Number(
                dashboard.monthlyRevenue || 0
            ).toLocaleString()}`,
            color: "bg-indigo-600",
            icon: <FaCalendarAlt size={35} />
        }

    ];

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">

            <Sidebar />

            <div className="flex-1 p-8 text-gray-900 dark:text-white">

                <h1 className="text-4xl font-bold mb-10">

                    Admin Dashboard

                </h1>


                {/* =========================
                    DASHBOARD CARDS
                ========================= */}

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {cards.map((card, index) => (

                        <div
                            key={index}
                            className={`${card.color} text-white rounded-2xl p-7 shadow-lg`}
                        >

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-sm">

                                        {card.title}

                                    </p>

                                    <h2 className="text-3xl font-bold mt-3">

                                        {card.value}

                                    </h2>

                                </div>

                                {card.icon}

                            </div>

                        </div>

                    ))}

                </div>


                {/* =========================
                    BUSINESS REVENUE
                ========================= */}

                <div className="mt-10">

                    <h2 className="text-2xl font-bold mb-6">

                        💰 Business Revenue

                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">


                        {/* Provider Cost */}

                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500 dark:text-gray-400">

                                        Provider Cost

                                    </p>

                                    <h3 className="text-3xl font-bold mt-2">

                                        ₦{Number(
                                            revenue.totalProviderCost || 0
                                        ).toLocaleString()}

                                    </h3>

                                </div>

                                <FaMoneyBillWave
                                    size={30}
                                    className="text-orange-500"
                                />

                            </div>

                        </div>


                        {/* Customer Amount */}

                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500 dark:text-gray-400">

                                        Customer Paid

                                    </p>

                                    <h3 className="text-3xl font-bold mt-2">

                                        ₦{Number(
                                            revenue.totalCustomerAmount || 0
                                        ).toLocaleString()}

                                    </h3>

                                </div>

                                <FaWallet
                                    size={30}
                                    className="text-blue-500"
                                />

                            </div>

                        </div>


                        {/* Profit */}

                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500 dark:text-gray-400">

                                        Total Profit

                                    </p>

                                    <h3 className="text-3xl font-bold mt-2 text-green-500">

                                        ₦{Number(
                                            revenue.totalProfit || 0
                                        ).toLocaleString()}

                                    </h3>

                                </div>

                                <FaChartLine
                                    size={30}
                                    className="text-green-500"
                                />

                            </div>

                        </div>

                    </div>

                </div>

                <div className="mt-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

    <h2 className="text-2xl font-bold mb-6">

        💰 Recent Profit Transactions

    </h2>

    <div className="overflow-x-auto">

        <table className="w-full">

            <thead className="border-b">

                <tr>

                    <th className="text-left py-3">Customer</th>
                    <th className="text-left py-3">Service</th>
                    <th className="text-left py-3">Provider Cost</th>
                    <th className="text-left py-3">Customer Paid</th>
                    <th className="text-left py-3">Profit</th>
                    <th className="text-left py-3">Reference</th>
                    <th className="text-left py-3">Status</th>

                </tr>

            </thead>

            <tbody>

                {recentRevenue.map((item) => (

                    <tr
                        key={item.id}
                        className="border-b hover:bg-gray-100 dark:hover:bg-slate-700"
                    >

                        <td className="py-3">

                            {item.fullname}

                        </td>

                        <td className="py-3 capitalize">

                            {item.service_type}

                        </td>

                        <td className="py-3 text-orange-600 font-semibold">

                            ₦{Number(item.provider_cost).toLocaleString()}

                        </td>

                        <td className="py-3 text-blue-600 font-semibold">

                            ₦{Number(item.customer_amount).toLocaleString()}

                        </td>

                        <td className="py-3 text-green-600 font-bold">

                            ₦{Number(item.profit).toLocaleString()}

                        </td>

                        <td className="py-3">

                            {item.reference}

                        </td>

                        <td className="py-3">

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                {item.status}

                            </span>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    </div>

</div>


                {/* =========================
                    ANALYTICS
                ========================= */}

                <div className="mt-10">

                    <AdminCharts
                        analytics={analytics}
                    />

                </div>


                {/* =========================
                    TOP SERVICES
                ========================= */}

                <div className="mt-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                    <h2 className="text-2xl font-bold mb-6">

                        🏆 Top Services

                    </h2>

                    <div className="space-y-4">

                        {topServices.map((service) => (

                            <div
                                key={service.type}
                                className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-4"
                            >

                                <div>

                                    <h3 className="font-semibold capitalize">

                                        {service.type}

                                    </h3>

                                    <p className="text-gray-500 dark:text-gray-400 text-sm">

                                        {service.totalTransactions} Transactions

                                    </p>

                                </div>

                                <div className="text-green-600 font-bold text-lg">

                                    ₦{Number(
                                        service.totalRevenue
                                    ).toLocaleString()}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* =========================
                    RECENT ACTIVITY
                ========================= */}

                <div className="mt-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                    <h2 className="text-2xl font-bold mb-6">

                        🕒 Recent Activity

                    </h2>

                    <div className="space-y-4">

                        {activityLogs.map((log) => (

                            <div
                                key={log.id}
                                className="border-b border-gray-200 dark:border-slate-700 pb-4"
                            >

                                <div className="flex justify-between">

                                    <div>

                                        <h3 className="font-semibold">

                                            {log.action}

                                        </h3>

                                        <p className="text-gray-500 dark:text-gray-400">

                                            {log.fullname}

                                        </p>

                                        <p className="text-sm text-gray-400">

                                            {log.target}

                                        </p>

                                    </div>

                                    <span className="text-sm text-gray-500">

                                        {new Date(
                                            log.created_at
                                        ).toLocaleString()}

                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;