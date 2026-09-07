import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";

function AdminBusinessWithdrawals() {

    const [withdrawals, setWithdrawals] = useState([]);

    useEffect(() => {

        loadWithdrawals();

    }, []);

    const loadWithdrawals = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/business-withdrawals",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setWithdrawals(response.data.withdrawals);

        } catch (err) {

            console.log(err);

        }

    };

    const approveWithdrawal = async (id) => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/business-withdrawals/approve/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            loadWithdrawals();

        } catch (err) {

            console.log(err);

        }

    };

    const rejectWithdrawal = async (id) => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/business-withdrawals/reject/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            loadWithdrawals();

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">

            <Sidebar />

            <div className="flex-1 p-8">

                <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">

                    Business Withdrawals

                </h1>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow">

                    <table className="w-full">

                        <thead>

                            <tr className="border-b">

                                <th className="p-4 text-left">Reference</th>

                                <th className="p-4 text-left">Amount</th>

                                <th className="p-4 text-left">Bank</th>

                                <th className="p-4 text-left">Account</th>

                                <th className="p-4 text-left">Status</th>

                                <th className="p-4 text-left">Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {withdrawals.map((item) => (

                                <tr key={item.id} className="border-b">

                                    <td className="p-4">

                                        {item.reference}

                                    </td>

                                    <td className="p-4">

                                        ₦{Number(item.amount).toLocaleString()}

                                    </td>

                                    <td className="p-4">

                                        {item.bank_name}

                                    </td>

                                    <td className="p-4">

                                        {item.account_name}

                                    </td>

                                    <td className="p-4">

                                        {item.status}

                                    </td>

                                    <td className="p-4">

                                        {item.status === "pending" && (

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() => approveWithdrawal(item.id)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() => rejectWithdrawal(item.id)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                                >
                                                    Reject
                                                </button>

                                            </div>

                                        )}

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

export default AdminBusinessWithdrawals;