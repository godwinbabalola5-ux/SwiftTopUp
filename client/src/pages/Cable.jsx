import { useEffect, useState, useContext } from "react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/ui/Button";
import api from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

function Cable() {

    const { refreshUser } = useContext(AuthContext);

    const [providers, setProviders] = useState([]);
    const [provider, setProvider] = useState("dstv");
    const [plans, setPlans] = useState([]);
    const [variationCode, setVariationCode] = useState("");
    const [amount, setAmount] = useState("");
    const [smartcard, setSmartcard] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        loadProviders();

    }, []);

    useEffect(() => {

        if (provider) {

            loadPlans();

        }

    }, [provider]);

    const loadProviders = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/cable/providers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProviders(response.data.providers);

        } catch (error) {

            toast.error("Unable to load providers.");

        }

    };

    const loadPlans = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                `/cable/plans/${provider}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPlans(response.data.plans);

        } catch (error) {

            toast.error("Unable to load cable plans.");

        }

    };

    const handlePlan = (e) => {

        const code = e.target.value;

        setVariationCode(code);

        const selected = plans.find(
            (plan) => plan.variation_code === code
        );

        if (selected) {

            setAmount(selected.variation_amount);

        }

    };

    const buyCable = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/cable/buy",
                {
                    provider,
                    smartcard,
                    variation_code: variationCode,
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

            setSmartcard("");
            setVariationCode("");
            setAmount("");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Cable subscription failed."
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

                    Cable TV Subscription

                </h1>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 max-w-xl transition-colors duration-300">

                    <form
                        onSubmit={buyCable}
                        className="space-y-5"
                    >

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">

                                Provider

                            </label>

                            <select
                                value={provider}
                                onChange={(e) => setProvider(e.target.value)}
                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            >

                                {providers.map((item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >

                                        {item.name}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">

                                Bouquet

                            </label>

                            <select
                                value={variationCode}
                                onChange={handlePlan}
                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            >

                                <option value="">

                                    Select Bouquet

                                </option>

                                {plans.map((plan) => (

                                    <option
                                        key={plan.variation_code}
                                        value={plan.variation_code}
                                    >

                                        {plan.name}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">

                                Amount

                            </label>

                            <input
                                type="text"
                                value={amount}
                                readOnly
                                className="w-full border rounded-lg p-3 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />

                        </div>

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">

                                Smart Card / IUC Number

                            </label>

                            <input
                                type="text"
                                value={smartcard}
                                onChange={(e) => setSmartcard(e.target.value)}
                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400"
                                placeholder="Enter Smart Card Number"
                                required
                            />

                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                        >

                            Subscribe Now

                        </Button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default Cable;