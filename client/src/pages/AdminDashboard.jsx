import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import AdminCharts from "../components/admin/AdminCharts";
import socket from "../services/socket";

import {
    FaUsers,
    FaWallet,
    FaMoneyBillWave,
    FaExchangeAlt,
    FaCalendarDay,
    FaCalendarAlt
} from "react-icons/fa";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState({});
    const [analytics, setAnalytics] = useState([]);
    const [topServices, setTopServices] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);

    useEffect(() => {

        loadDashboard();
        loadAnalytics();
        loadTopServices();
        loadActivityLogs();

        socket.on("newTransaction", () => {

            loadDashboard();
            loadAnalytics();
            loadTopServices();
            loadActivityLogs();

        });

        return () => {

            socket.off("newTransaction");

        };

    }, []);

    const loadDashboard = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/admin/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDashboard(response.data.dashboard);

        } catch (err) {

            console.log(err);

        }

    };

    const loadAnalytics = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/admin/analytics", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAnalytics(response.data.analytics);

        } catch (err) {

            console.log(err);

        }

    };

    const loadTopServices = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/admin/top-services", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTopServices(response.data.services);

        } catch (err) {

            console.log(err);

        }

    };

    const loadActivityLogs = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/admin/activity-logs", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setActivityLogs(response.data.logs);

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
            value: `₦${Number(dashboard.totalWallet || 0).toLocaleString()}`,
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
            value: `₦${Number(dashboard.totalFunding || 0).toLocaleString()}`,
            color: "bg-pink-600",
            icon: <FaMoneyBillWave size={35} />
        },

        {
            title: "Today's Revenue",
            value: `₦${Number(dashboard.todayRevenue || 0).toLocaleString()}`,
            color: "bg-red-600",
            icon: <FaCalendarDay size={35} />
        },

        {
            title: "Monthly Revenue",
            value: `₦${Number(dashboard.monthlyRevenue || 0).toLocaleString()}`,
            color: "bg-indigo-600",
            icon: <FaCalendarAlt size={35} />
        }

    ];

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">

            <Sidebar />

            <div className="flex-1 p-8 text-gray-900 dark:text-white transition-colors duration-300">

                <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">

                    Admin Dashboard

                </h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {cards.map((card, index) => (

                        <div
                            key={index}
                            className={`${card.color} text-white rounded-2xl p-7 shadow-lg transition-all duration-300`}
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

                <div className="mt-10">

                    <AdminCharts analytics={analytics} />

                </div>

                <div className="mt-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">

                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">

                        🏆 Top Services

                    </h2>

                    <div className="space-y-4">

                        {topServices.map((service) => (

                            <div
                                key={service.type}
                                className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-4"
                            >

                                <div>

                                    <h3 className="font-semibold text-gray-900 dark:text-white capitalize">

                                        {service.type}

                                    </h3>

                                    <p className="text-gray-500 dark:text-gray-400 text-sm">

                                        {service.totalTransactions} Transactions

                                    </p>

                                </div>

                                <div className="text-green-600 font-bold text-lg">

                                    ₦{Number(service.totalRevenue).toLocaleString()}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                <div className="mt-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">

                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">

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

                                        <h3 className="font-semibold text-gray-900 dark:text-white">

                                            {log.action}

                                        </h3>

                                        <p className="text-gray-500 dark:text-gray-400">

                                            {log.fullname}

                                        </p>

                                        <p className="text-sm text-gray-400 dark:text-gray-500">

                                            {log.target}

                                        </p>

                                    </div>

                                    <span className="text-sm text-gray-500 dark:text-gray-400">

                                        {new Date(log.created_at).toLocaleString()}

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