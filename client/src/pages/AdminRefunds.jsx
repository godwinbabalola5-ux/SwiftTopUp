import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import { toast } from "react-hot-toast";

function AdminRefunds() {

    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        loadRefunds();
    }, []);

    const loadRefunds = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/refunds",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRefunds(response.data.refunds || []);

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load refund requests."
            );

        } finally {

            setLoading(false);

        }

    };

    const approveRefund = async (id) => {

        try {

            setProcessing(id);

            const token = localStorage.getItem("token");

            await api.put(
                `/admin/refunds/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Refund approved successfully.");

            loadRefunds();

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Refund approval failed."
            );

        } finally {

            setProcessing(null);

        }

    };

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">

            <Sidebar />

            <div className="flex-1 p-8">

                {/* HEADER */}

                <div className="mb-8">

                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Refund Management
                    </h1>

                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Review and process customer refund requests.
                    </p>

                </div>


                {/* SUMMARY */}

                <div className="grid md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                        <p className="text-gray-500 dark:text-gray-400">
                            Pending Refunds
                        </p>

                        <h2 className="text-3xl font-bold text-orange-500 mt-3">
                            {refunds.length}
                        </h2>

                    </div>


                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                        <p className="text-gray-500 dark:text-gray-400">
                            Total Refund Amount
                        </p>

                        <h2 className="text-3xl font-bold text-blue-600 mt-3">

                            ₦{
                                refunds
                                    .reduce(
                                        (sum, refund) =>
                                            sum + Number(refund.refund_amount || 0),
                                        0
                                    )
                                    .toLocaleString()
                            }

                        </h2>

                    </div>


                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                        <p className="text-gray-500 dark:text-gray-400">
                            Status
                        </p>

                        <h2 className="text-3xl font-bold text-yellow-500 mt-3">
                            Awaiting Review
                        </h2>

                    </div>

                </div>


                {/* REFUND TABLE */}

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">

                    {loading ? (

                        <div className="p-10 text-center text-gray-500">
                            Loading refund requests...
                        </div>

                    ) : refunds.length === 0 ? (

                        <div className="p-12 text-center">

                            <div className="text-5xl mb-4">
                                💰
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                No Pending Refunds
                            </h2>

                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                There are currently no refund requests waiting for approval.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-blue-600 text-white">

                                    <tr>

                                        <th className="p-4 text-left">
                                            Customer
                                        </th>

                                        <th className="p-4 text-left">
                                            Transaction
                                        </th>

                                        <th className="p-4 text-left">
                                            Original Amount
                                        </th>

                                        <th className="p-4 text-left">
                                            Refund
                                        </th>

                                        <th className="p-4 text-left">
                                            Reason
                                        </th>

                                        <th className="p-4 text-left">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {refunds.map((refund) => (

                                        <tr
                                            key={refund.id}
                                            className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                                        >

                                            <td className="p-4">

                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {refund.customer}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {refund.email}
                                                </p>

                                            </td>


                                            <td className="p-4">

                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    {refund.type}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {refund.reference}
                                                </p>

                                            </td>


                                            <td className="p-4 font-semibold">

                                                ₦{Number(
                                                    refund.amount
                                                ).toLocaleString()}

                                            </td>


                                            <td className="p-4">

                                                <span className="font-bold text-orange-600">

                                                    ₦{Number(
                                                        refund.refund_amount
                                                    ).toLocaleString()}

                                                </span>

                                            </td>


                                            <td className="p-4 max-w-xs">

                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {refund.failure_reason || "No reason provided"}
                                                </p>

                                            </td>


                                            <td className="p-4">

                                                <button
                                                    onClick={() => approveRefund(refund.id)}
                                                    disabled={processing === refund.id}
                                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 disabled:opacity-50 text-white px-5 py-2 rounded-xl shadow-md transition"
                                                >

                                                    {processing === refund.id
                                                        ? "Processing..."
                                                        : "Approve Refund"
                                                    }

                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default AdminRefunds;