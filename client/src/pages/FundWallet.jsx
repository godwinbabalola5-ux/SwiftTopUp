import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";

function FundWallet() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/payment/initialize",
        {
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = response.data.data.authorization_url;
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to initialize payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 font-semibold"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold">
          Fund Wallet
        </h1>

        <div className="bg-white rounded-xl shadow p-8 mt-8 max-w-lg">

          <label className="block mb-2 font-semibold">
            Amount
          </label>

          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg p-4"
          />

          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold"
          >
            {loading ? "Processing..." : "Continue Payment"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default FundWallet;