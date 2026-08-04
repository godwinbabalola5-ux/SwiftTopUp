import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import { toast } from "react-hot-toast";

function RefundRequest() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const submitRefund = async () => {

        if (!amount || Number(amount) <= 0) {
            return toast.error("Enter refund amount.");
        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            await api.post(
                `/refunds/request/${id}`,
                {
                    amount,
                    reason
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Refund request submitted.");

            navigate("/transactions");

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Unable to submit refund."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1 p-8">

                <h1 className="text-4xl font-bold mb-8">
                    Request Refund
                </h1>

                <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl">

                    <label className="font-semibold">
                        Refund Amount
                    </label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e)=>setAmount(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-2 mb-6"
                    />

                    <label className="font-semibold">
                        Reason
                    </label>

                    <textarea
                        rows="5"
                        value={reason}
                        onChange={(e)=>setReason(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-2"
                    />

                    <button
                        onClick={submitRefund}
                        disabled={loading}
                        className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold"
                    >
                        {loading ? "Submitting..." : "Submit Refund Request"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default RefundRequest;