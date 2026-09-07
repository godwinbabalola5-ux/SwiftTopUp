import { useEffect, useState, useContext } from "react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/ui/Button";
import BeneficiaryPicker from "../components/BeneficiaryPicker";
import PinPrompt from "../components/PinPrompt";
import api from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { detectNetworkFromPhone } from "../utils/detectNetwork";

function Data() {
    const { refreshUser } = useContext(AuthContext);

    const [network, setNetwork] = useState("mtn");
    const [plans, setPlans] = useState([]);
    const [variationCode, setVariationCode] = useState("");
    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [plansLoading, setPlansLoading] = useState(false);
    const [showPinPrompt, setShowPinPrompt] = useState(false);

    // Same convention as Airtime.jsx — once the user manually picks a
    // network, stop overriding it as they keep typing the phone number.
    const [networkManuallySet, setNetworkManuallySet] = useState(false);

    const handlePhoneChange = (e) => {

        const value = e.target.value;
        setPhone(value);

        if (networkManuallySet) return;

        const detected = detectNetworkFromPhone(value);

        // Only switch (and re-trigger the plans reload below) if it's
        // actually a different network than what's already selected —
        // otherwise every keystroke would reset the chosen plan for no reason.
        if (detected && detected !== network) {
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

    useEffect(() => {
        loadPlans();
    }, [network]);

    const loadPlans = async () => {
        try {
            setPlansLoading(true);

            setPlans([]);
            setVariationCode("");
            setAmount("");

            const token = localStorage.getItem("token");

            const response = await api.get(
                `/data/plans/${network}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const loadedPlans = response.data.plans || [];

            setPlans(loadedPlans);

            if (loadedPlans.length === 0) {
                toast.info("No data plans available for this network.");
            }

        } catch (error) {
            console.error("DATA PLANS ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load data plans."
            );

        } finally {
            setPlansLoading(false);
        }
    };

    const handlePlanChange = (e) => {
        const code = e.target.value;

        setVariationCode(code);

        const selected = plans.find(
            (plan) => plan.variation_code === code
        );

        if (selected) {
            setAmount(
                selected.variation_amount ||
                selected.amount ||
                ""
            );
        } else {
            setAmount("");
        }
    };

    const buyData = (e) => {
        e.preventDefault();

        if (!variationCode) {
            toast.error("Please select a data plan.");
            return;
        }

        if (!phone) {
            toast.error("Please enter a phone number.");
            return;
        }

        setShowPinPrompt(true);
    };

    const submitPurchase = async (pin) => {

        try {
            setLoading(true);

            const response = await api.post(
                "/data/buy",
                {
                    network,
                    phone,
                    variation_code: variationCode,
                    amount: Number(amount),
                    pin
                }
            );

            toast.success(response.data.message);

            await refreshUser();

            setShowPinPrompt(false);
            setPhone("");
            setVariationCode("");
            setAmount("");
            setNetworkManuallySet(false);

        } catch (error) {
            console.error("DATA PURCHASE ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Data purchase failed."
            );

        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (value) => {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return value;
        }

        return `₦${number.toLocaleString()}`;
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

            <Sidebar />

            <div className="flex-1 p-8 text-gray-900 dark:text-white">

                <h1 className="text-4xl font-bold mb-2">
                    Data Purchase
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Choose your network and data plan.
                </p>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 max-w-xl">

                    <form
                        onSubmit={buyData}
                        className="space-y-5"
                    >

                        {/* NETWORK */}

                        <div>
                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                                Network
                            </label>

                            <select
                                value={network}
                                onChange={handleNetworkChange}
                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            >
                                <option value="mtn">
                                    MTN
                                </option>

                                <option value="airtel">
                                    Airtel
                                </option>

                                <option value="glo">
                                    Glo
                                </option>

                                <option value="9mobile">
                                    9mobile
                                </option>
                            </select>

                            {!networkManuallySet && phone.length >= 4 && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Auto-detected from phone number — change it above if this isn't right.
                                </p>
                            )}
                        </div>

                        {/* DATA PLAN */}

                        <div>
                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                                Select Data Plan
                            </label>

                            <select
                                value={variationCode}
                                onChange={handlePlanChange}
                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                required
                                disabled={plansLoading}
                            >

                                <option value="">
                                    {plansLoading
                                        ? "Loading data plans..."
                                        : "Select Plan"
                                    }
                                </option>

                                {plans.map((plan) => (
                                    <option
                                        key={plan.variation_code}
                                        value={plan.variation_code}
                                    >
                                        {plan.name}
                                        {" - "}
                                        {formatAmount(
                                            plan.variation_amount ||
                                            plan.amount
                                        )}
                                        {plan.validity
                                            ? ` - ${plan.validity}`
                                            : ""
                                        }
                                    </option>
                                ))}

                            </select>

                            {!plansLoading && plans.length > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {plans.length} data plans available
                                </p>
                            )}
                        </div>

                        {/* SELECTED PLAN DETAILS */}

                        {variationCode && (
                            <div className="rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900 p-4">

                                <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                                    Selected Plan
                                </p>

                                {(() => {
                                    const selected = plans.find(
                                        (plan) =>
                                            plan.variation_code === variationCode
                                    );

                                    if (!selected) {
                                        return null;
                                    }

                                    return (
                                        <div className="space-y-1 text-sm">

                                            <p>
                                                <strong>Plan:</strong>{" "}
                                                {selected.name}
                                            </p>

                                            <p>
                                                <strong>Price:</strong>{" "}
                                                {formatAmount(
                                                    selected.variation_amount ||
                                                    selected.amount
                                                )}
                                            </p>

                                            {selected.validity && (
                                                <p>
                                                    <strong>Validity:</strong>{" "}
                                                    {selected.validity}
                                                </p>
                                            )}

                                        </div>
                                    );
                                })()}

                            </div>
                        )}

                        {/* AMOUNT */}

                        <div>
                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                                Amount
                            </label>

                            <input
                                type="text"
                                value={
                                    amount
                                        ? formatAmount(amount)
                                        : ""
                                }
                                readOnly
                                placeholder="Select a plan"
                                className="w-full border rounded-lg p-3 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        {/* PHONE NUMBER */}

                        <div>
                            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                                Phone Number
                            </label>

                            <BeneficiaryPicker
                                type="data"
                                value={phone}
                                network={network}
                                onSelect={handleBeneficiarySelect}
                            />

                            <input
                                type="tel"
                                placeholder="08011111111"
                                value={phone}
                                onChange={handlePhoneChange}
                                className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400"
                                required
                            />
                        </div>

                        {/* BUY BUTTON */}

                        <Button
                            type="submit"
                            loading={loading}
                            disabled={
                                loading ||
                                plansLoading ||
                                !variationCode ||
                                !amount
                            }
                        >
                            Buy Data
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

export default Data;