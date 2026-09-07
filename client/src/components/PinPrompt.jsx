import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * Shown right before a purchase actually submits. Checks whether the
 * user has a PIN set at all — if not, prompts them to go set one
 * instead of showing a PIN box that can't possibly be filled correctly.
 *
 * Props:
 *  - onConfirm(pin): called with the 4-digit PIN once entered
 *  - onCancel(): called when the user backs out
 *  - loading: disables the confirm button while the purchase is in flight
 */
function PinPrompt({ onConfirm, onCancel, loading }) {

    const navigate = useNavigate();

    const [hasPin, setHasPin] = useState(null); // null = still checking
    const [pin, setPin] = useState("");

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {

        try {

            const response = await api.get("/users/pin/status");
            setHasPin(response.data.hasPin);

        } catch (error) {

            console.log("PIN STATUS ERROR:", error);
            // If we can't even check, let them try — the backend will
            // reject with a clear message if something's actually wrong.
            setHasPin(true);

        }

    };

    const handlePinChange = (e) => {
        setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
    };

    const handleConfirm = () => {

        if (pin.length !== 4) return;

        onConfirm(pin);

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white dark:bg-slate-900 rounded-2xl w-[380px] p-8 shadow-2xl text-center">

                {hasPin === null && (
                    <p className="text-gray-500 dark:text-gray-400">Checking...</p>
                )}

                {hasPin === false && (

                    <>
                        <h2 className="text-xl font-bold mb-3 dark:text-white">
                            Set a Transaction PIN First
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            You need a 4-digit transaction PIN before you can make purchases. This keeps your wallet safe even if someone else picks up your phone.
                        </p>

                        <div className="flex justify-center gap-4">

                            <button
                                onClick={onCancel}
                                className="px-5 py-3 rounded-xl bg-gray-400 text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => navigate("/profile")}
                                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Set PIN Now
                            </button>

                        </div>
                    </>

                )}

                {hasPin === true && (

                    <>
                        <h2 className="text-xl font-bold mb-2 dark:text-white">
                            Enter Transaction PIN
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Confirm your 4-digit PIN to complete this purchase.
                        </p>

                        <input
                            type="password"
                            inputMode="numeric"
                            value={pin}
                            onChange={handlePinChange}
                            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                            maxLength={4}
                            autoFocus
                            className="w-full border dark:border-slate-700 rounded-xl p-4 mb-6 dark:bg-slate-800 dark:text-white text-center tracking-[0.6em] text-2xl"
                        />

                        <div className="flex justify-center gap-4">

                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="px-5 py-3 rounded-xl bg-gray-400 text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirm}
                                disabled={loading || pin.length !== 4}
                                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white"
                            >
                                {loading ? "Processing..." : "Confirm"}
                            </button>

                        </div>
                    </>

                )}

            </div>

        </div>

    );

}

export default PinPrompt;
