import { useState, useContext } from "react";
import Sidebar from "../components/layout/Sidebar";
import BeneficiaryPicker from "../components/BeneficiaryPicker";
import PinPrompt from "../components/PinPrompt";
import api from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { detectNetworkFromPhone } from "../utils/detectNetwork";

function Airtime() {

    const { refreshUser } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);

    const [network, setNetwork] = useState("mtn");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPinPrompt, setShowPinPrompt] = useState(false);

    // Tracks whether the user has manually picked a network themselves —
    // once they do, we stop overriding their choice as they keep typing
    // the phone number (auto-detect is a convenience, not something that
    // should fight the user for control of the dropdown).
    const [networkManuallySet, setNetworkManuallySet] = useState(false);

    const handlePhoneChange = (e) => {

        const value = e.target.value;
        setPhone(value);

        if (networkManuallySet) return;

        const detected = detectNetworkFromPhone(value);

        if (detected) {
            setNetwork(detected);
        }

    };

    const handleNetworkChange = (e) => {
        setNetwork(e.target.value);
        setNetworkManuallySet(true);
    };

    const handleBeneficiarySelect = (beneficiary) => {

        setPhone(beneficiary.value);

        if (beneficiary.network) {
            setNetwork(beneficiary.network);
            setNetworkManuallySet(true);
        }

    };

    const buyAirtime = (e) => {

        e.preventDefault();

        if (!phone || !amount) {
            toast.error("Enter a phone number and amount.");
            return;
        }

        // Don't hit the API yet — confirm the PIN first. The actual
        // purchase call happens in submitPurchase below, once we have it.
        setShowPinPrompt(true);

    };

    const submitPurchase = async (pin) => {

        try {

            setLoading(true);

            const response = await api.post(
                "/airtime/buy",
                {
                    network,
                    phone,
                    amount: Number(amount),
                    pin
                }
            );

            await refreshUser();

            toast.success(response.data.message);

            setShowPinPrompt(false);
            setPhone("");
            setAmount("");
            setNetwork("mtn");
            setNetworkManuallySet(false);

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
                                onChange={handleNetworkChange}
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

                            {!networkManuallySet && phone.length >= 4 && (
                                <p
                                    className={`mt-1 text-xs ${
                                        darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Auto-detected from phone number — change it above if this isn't right.
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block mb-2 font-semibold">

                                Phone Number

                            </label>

                            <BeneficiaryPicker
                                type="airtime"
                                value={phone}
                                network={network}
                                onSelect={handleBeneficiarySelect}
                            />

                            <input
                                type="text"
                                placeholder="08011111111"
                                value={phone}
                                onChange={handlePhoneChange}
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

            {showPinPrompt && (
                <PinPrompt
                    onConfirm={submitPurchase}
                    onCancel={() => setShowPinPrompt(false)}
                    loading={loading}
                />
            )}

        </div>

    );

}

export default Airtime;