import { useEffect, useState, useContext } from "react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/ui/Button";
import BeneficiaryPicker from "../components/BeneficiaryPicker";
import PinPrompt from "../components/PinPrompt";
import api from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

function Electricity() {

    const { refreshUser } = useContext(AuthContext);

    const [providers, setProviders] = useState([]);
    const [disco, setDisco] = useState("");
    const [meterNumber, setMeterNumber] = useState("");
    const [meterType, setMeterType] = useState("prepaid");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPinPrompt, setShowPinPrompt] = useState(false);

    const handleBeneficiarySelect = (beneficiary) => {

        setMeterNumber(beneficiary.value);

        if (beneficiary.network) {
            setDisco(beneficiary.network);
        }

    };

    useEffect(() => {

        loadProviders();

    }, []);

    const loadProviders = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/electricity/providers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProviders(response.data.discos);

        } catch (error) {

            toast.error("Unable to load electricity providers.");

        }

    };

    const buyElectricity = (e) => {

        e.preventDefault();

        if (!disco || !meterNumber || !amount) {
            toast.error("Fill in all fields before continuing.");
            return;
        }

        setShowPinPrompt(true);

    };

    const submitPurchase = async (pin) => {

        try {

            setLoading(true);

            const response = await api.post(

                "/electricity/buy",

                {
                    disco,
                    meter_number: meterNumber,
                    meter_type: meterType,
                    amount: Number(amount),
                    pin
                }

            );

            toast.success(response.data.message);

            await refreshUser();

            setShowPinPrompt(false);
            setMeterNumber("");
            setAmount("");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Electricity purchase failed."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

            <Sidebar />

            <div className="flex-1 p-8 text-gray-900 dark:text-white transition-colors duration-300">

                <h1 className="text-4xl font-bold mb-8">

                    Electricity Bills

                </h1>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 max-w-xl transition-colors duration-300">

                    <form
                        onSubmit={buyElectricity}
                        className="space-y-5"
                    >

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">

                                Distribution Company

                            </label>

                            <select
                                value={disco}
                                onChange={(e) => setDisco(e.target.value)}
                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                required
                            >

                                <option value="">

                                    Select Provider

                                </option>

                                {providers.map((provider) => (

                                    <option
                                        key={provider.id}
                                        value={provider.id}
                                    >

                                        {provider.name}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">

                                Meter Type

                            </label>

                            <select
                                value={meterType}
                                onChange={(e) => setMeterType(e.target.value)}
                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            >

                                <option value="prepaid">

                                    Prepaid

                                </option>

                                <option value="postpaid">

                                    Postpaid

                                </option>

                            </select>

                        </div>

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">

                                Meter Number

                            </label>

                            <BeneficiaryPicker
                                type="electricity"
                                value={meterNumber}
                                network={disco}
                                onSelect={handleBeneficiarySelect}
                            />

                            <input
                                type="text"
                                placeholder="Enter meter number"
                                value={meterNumber}
                                onChange={(e) => setMeterNumber(e.target.value)}
                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400"
                                required
                            />

                        </div>

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">

                                Amount

                            </label>

                            <input
                                type="number"
                                placeholder="1000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400"
                                required
                            />

                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                        >

                            Pay Electricity Bill

                        </Button>

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

export default Electricity;