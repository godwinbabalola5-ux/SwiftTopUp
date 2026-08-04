import { useState, useContext } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

function Airtime() {

    const { refreshUser } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);

    const [network, setNetwork] = useState("mtn");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const buyAirtime = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/airtime/buy",
                {
                    network,
                    phone,
                    amount: Number(amount)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await refreshUser();

            toast.success(response.data.message);

            setPhone("");
            setAmount("");
            setNetwork("mtn");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Airtime purchase failed."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div
            className={`flex min-h-screen ${
                darkMode
                    ? "bg-gray-900"
                    : "bg-gray-100"
            }`}
        >

            <Sidebar />

            <div className="flex-1 p-8">

                <h1
                    className={`text-4xl font-bold mb-8 ${
                        darkMode
                            ? "text-white"
                            : "text-gray-900"
                    }`}
                >

                    Airtime Purchase

                </h1>

                <div
                    className={`rounded-2xl shadow-lg p-8 max-w-lg ${
                        darkMode
                            ? "bg-gray-800 text-white"
                            : "bg-white"
                    }`}
                >

                    <form
                        onSubmit={buyAirtime}
                        className="space-y-5"
                    >

                        <div>

                            <label className="block mb-2 font-semibold">

                                Network

                            </label>

                            <select
                                value={network}
                                onChange={(e) => setNetwork(e.target.value)}
                                className={`w-full rounded-lg p-3 border ${
                                    darkMode
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "border-gray-300 bg-white"
                                }`}
                            >
                                <option value="mtn">MTN</option>
                                <option value="airtel">Airtel</option>
                                <option value="glo">Glo</option>
                                <option value="9mobile">9mobile</option>
                            </select>

                        </div>

                        <div>

                            <label className="block mb-2 font-semibold">

                                Phone Number

                            </label>

                            <input
                                type="text"
                                placeholder="08011111111"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={`w-full rounded-lg p-3 border ${
                                    darkMode
                                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        : "border-gray-300 bg-white"
                                }`}
                                required
                            />

                        </div>

                        <div>

                            <label className="block mb-2 font-semibold">

                                Amount

                            </label>

                            <input
                                type="number"
                                placeholder="100"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={`w-full rounded-lg p-3 border ${
                                    darkMode
                                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        : "border-gray-300 bg-white"
                                }`}
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-bold text-white ${
                                loading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                            }`}
                        >

                            {loading ? "Processing..." : "Buy Airtime"}

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default Airtime;