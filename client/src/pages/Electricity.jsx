import { useEffect, useState, useContext } from "react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/ui/Button";
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

    const buyElectricity = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.post(

                "/electricity/buy",

                {
                    disco,
                    meter_number: meterNumber,
                    meter_type: meterType,
                    amount: Number(amount)
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            toast.success(response.data.message);

            await refreshUser();

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

        </div>

    );

}

export default Electricity;