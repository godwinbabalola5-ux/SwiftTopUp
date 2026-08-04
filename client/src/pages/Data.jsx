import { useEffect, useState, useContext } from "react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/ui/Button";
import api from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

function Data() {

    const { refreshUser } = useContext(AuthContext);

    const [network, setNetwork] = useState("mtn");
    const [plans, setPlans] = useState([]);
    const [variationCode, setVariationCode] = useState("");
    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPlans();
    }, [network]);

    const loadPlans = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                `/data/plans/${network}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPlans(response.data.plans);

        } catch (error) {

            toast.error("Unable to load data plans.");

        }

    };

    const handlePlanChange = (e) => {

        const code = e.target.value;

        setVariationCode(code);

        const selected = plans.find(
            (plan) => plan.variation_code === code
        );

        if (selected) {

            setAmount(selected.variation_amount);

        }

    };

    const buyData = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.post(

                "/data/buy",

                {
                    network,
                    phone,
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

            setPhone("");
            setVariationCode("");
            setAmount("");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Data purchase failed."
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

                    Data Purchase

                </h1>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 max-w-xl transition-colors duration-300">

                    <form
                        onSubmit={buyData}
                        className="space-y-5"
                    >

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">

                                Network

                            </label>

                            <select

                                value={network}

                                onChange={(e) => setNetwork(e.target.value)}

                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"

                            >

                                <option value="mtn">MTN</option>
                                <option value="airtel">Airtel</option>
                                <option value="glo">Glo</option>
                                <option value="9mobile">9mobile</option>

                            </select>

                        </div>

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">

                                Select Data Plan

                            </label>

                            <select

                                value={variationCode}

                                onChange={handlePlanChange}

                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"

                                required

                            >

                                <option value="">

                                    Select Plan

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

                                Phone Number

                            </label>

                            <input

                                type="text"

                                placeholder="08011111111"

                                value={phone}

                                onChange={(e) => setPhone(e.target.value)}

                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400"

                                required

                            />

                        </div>

                        <Button

                            type="submit"

                            loading={loading}

                        >

                            Buy Data

                        </Button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default Data;