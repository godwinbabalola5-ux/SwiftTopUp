import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import socket from "../services/socket";

import {
    FaWallet,
    FaChartLine,
    FaMoneyBillWave
} from "react-icons/fa";

function BusinessWallet() {

    const [wallet, setWallet] = useState({
    balance: 0,
    total_profit: 0,
    total_withdrawn: 0,
    updated_at: ""
});

const [todayProfit, setTodayProfit] = useState(0);
const [monthlyProfit, setMonthlyProfit] = useState(0);
const [services, setServices] = useState([]);

    useEffect(() => {

        loadWallet();

        socket.on("businessWalletUpdated", loadWallet);
        socket.on("revenueUpdated", loadWallet);
        socket.on("newTransaction", loadWallet);

        return () => {
            socket.off("businessWalletUpdated");
            socket.off("revenueUpdated");
            socket.off("newTransaction");
        };

    }, []);

    const loadWallet = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/business-wallet",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setWallet(response.data.wallet);
setTodayProfit(response.data.todayProfit);
setMonthlyProfit(response.data.monthlyProfit);
setServices(response.data.services);
        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">

            <Sidebar />

            <div className="flex-1 p-8">

                <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">

                    💼 Business Wallet

                </h1>

                <div className="grid md:grid-cols-3 gap-8">

                    <div className="bg-green-600 text-white rounded-2xl p-8 shadow-lg">

                        <div className="flex justify-between items-center">

                            <div>

                                <p>Business Balance</p>

                                <h2 className="text-3xl font-bold mt-3">

                                    ₦{Number(wallet.balance).toLocaleString()}

                                </h2>

                            </div>

                            <FaWallet size={40} />

                        </div>

                    </div>

                    <div className="bg-blue-600 text-white rounded-2xl p-8 shadow-lg">

                        <div className="flex justify-between items-center">

                            <div>

                                <p>Total Profit</p>

                                <h2 className="text-3xl font-bold mt-3">

                                    ₦{Number(wallet.total_profit).toLocaleString()}

                                </h2>

                            </div>

                            <FaChartLine size={40} />

                        </div>

                    </div>

                    <div className="bg-red-600 text-white rounded-2xl p-8 shadow-lg">

                        <div className="flex justify-between items-center">

                            <div>

                                <p>Total Withdrawn</p>

                                <h2 className="text-3xl font-bold mt-3">

                                    ₦{Number(wallet.total_withdrawn).toLocaleString()}

                                </h2>

                            </div>

                            <FaMoneyBillWave size={40} />

                        </div>
                        <div className="grid md:grid-cols-2 gap-8 mt-8">

    <div className="bg-indigo-600 text-white rounded-2xl p-8 shadow-lg">

        <p>Today's Profit</p>

        <h2 className="text-3xl font-bold mt-3">

            ₦{Number(todayProfit).toLocaleString()}

        </h2>

    </div>

    <div className="bg-purple-600 text-white rounded-2xl p-8 shadow-lg">

        <p>Monthly Profit</p>

        <h2 className="text-3xl font-bold mt-3">

            ₦{Number(monthlyProfit).toLocaleString()}

        </h2>

    </div>

</div>

                    </div>

                </div>

                <div className="mt-10 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">

                    <h2 className="text-xl font-bold mb-4">

                        Wallet Information

                    </h2>

                    <p>

                        Last Updated:

                        {" "}

                        {wallet.updated_at
                            ? new Date(wallet.updated_at).toLocaleString()
                            : "-"}

                    </p>

                </div>
                <div className="mt-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

    <h2 className="text-2xl font-bold mb-6">

        Revenue By Service

    </h2>

    <table className="w-full">

        <thead>

            <tr className="border-b">

                <th className="text-left p-3">Service</th>
                <th className="text-left p-3">Transactions</th>
                <th className="text-left p-3">Revenue</th>
                <th className="text-left p-3">Profit</th>

            </tr>

        </thead>

        <tbody>

            {services.map((service) => (

                <tr key={service.service_type} className="border-b">

                    <td className="p-3 capitalize">
                        {service.service_type}
                    </td>

                    <td className="p-3">
                        {service.transactions}
                    </td>

                    <td className="p-3">
                        ₦{Number(service.revenue).toLocaleString()}
                    </td>

                    <td className="p-3 text-green-600 font-bold">
                        ₦{Number(service.profit).toLocaleString()}
                    </td>

                </tr>

            ))}

        </tbody>

    </table>

</div>

            </div>

        </div>

    );

}

export default BusinessWallet;