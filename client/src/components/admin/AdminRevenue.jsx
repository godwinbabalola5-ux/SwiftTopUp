import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminRevenue() {

    const [summary, setSummary] = useState({});
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        loadRevenue();
    }, []);

    const loadRevenue = async () => {

        try {

            const token = localStorage.getItem("token");

            const summaryResponse = await api.get(
                "/revenue/summary",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const transactionResponse = await api.get(
                "/revenue/recent",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSummary(summaryResponse.data.revenue);
            setTransactions(transactionResponse.data.revenue);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="space-y-8">

            <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">

                    <h3 className="text-gray-500">
                        Provider Cost
                    </h3>

                    <h1 className="text-3xl font-bold mt-2">
                        ₦{Number(summary.totalProviderCost || 0).toLocaleString()}
                    </h1>

                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">

                    <h3 className="text-gray-500">
                        Customer Paid
                    </h3>

                    <h1 className="text-3xl font-bold mt-2">
                        ₦{Number(summary.totalCustomerAmount || 0).toLocaleString()}
                    </h1>

                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">

                    <h3 className="text-gray-500">
                        Total Profit
                    </h3>

                    <h1 className="text-3xl font-bold text-green-600 mt-2">
                        ₦{Number(summary.totalProfit || 0).toLocaleString()}
                    </h1>

                </div>

            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow">

                <div className="p-6 border-b">

                    <h2 className="text-2xl font-bold">
                        Recent Profit Transactions
                    </h2>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100 dark:bg-slate-900">

                            <tr>

                                <th className="text-left p-4">Customer</th>

                                <th className="text-left p-4">Service</th>

                                <th className="text-left p-4">Provider Cost</th>

                                <th className="text-left p-4">Customer Paid</th>

                                <th className="text-left p-4">Profit</th>

                                <th className="text-left p-4">Reference</th>

                                <th className="text-left p-4">Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            {transactions.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50 dark:hover:bg-slate-900"
                                >

                                    <td className="p-4">
                                        {item.fullname}
                                    </td>

                                    <td className="p-4 capitalize">
                                        {item.service_type}
                                    </td>

                                    <td className="p-4">
                                        ₦{Number(item.provider_cost).toLocaleString()}
                                    </td>

                                    <td className="p-4">
                                        ₦{Number(item.customer_amount).toLocaleString()}
                                    </td>

                                    <td className="p-4 font-bold text-green-600">
                                        ₦{Number(item.profit).toLocaleString()}
                                    </td>

                                    <td className="p-4">
                                        {item.reference}
                                    </td>

                                    <td className="p-4">

                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">

                                            {item.status}

                                        </span>

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

export default AdminRevenue;