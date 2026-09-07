import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

// One modal handles both cases:
//  - no PIN set yet -> "Set Transaction PIN" (3 fields: new, confirm)
//  - PIN already set -> "Change Transaction PIN" (4 fields: current, new, confirm)
// which fields show depends on hasPin, checked when the modal opens.

function SetTransactionPinModal({ onClose }) {

    const [hasPin, setHasPin] = useState(null); // null = still checking
    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {

        try {

            const response = await api.get("/users/pin/status");
            setHasPin(response.data.hasPin);

        } catch (error) {

            console.log("PIN STATUS ERROR:", error);
            setHasPin(false); // fail open to the "set" form rather than get stuck

        }

    };

    const onlyDigits = (value) => value.replace(/\D/g, "").slice(0, 4);

    const handleSubmit = async () => {

        if (newPin.length !== 4) {
            toast.error("PIN must be exactly 4 digits.");
            return;
        }

        if (newPin !== confirmPin) {
            toast.error("PINs do not match.");
            return;
        }

        if (hasPin && currentPin.length !== 4) {
            toast.error("Enter your current 4-digit PIN.");
            return;
        }

        try {

            setLoading(true);

            if (hasPin) {

                const response = await api.post("/users/pin/change", {
                    currentPin,
                    newPin,
                    confirmNewPin: confirmPin
                });

                toast.success(response.data.message);

            } else {

                const response = await api.post("/users/pin/set", {
                    pin: newPin,
                    confirmPin
                });

                toast.success(response.data.message);

            }

            onClose();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to save PIN."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white dark:bg-slate-900 rounded-2xl w-[430px] p-8 shadow-2xl">

                <h2 className="text-3xl font-bold mb-2 dark:text-white">
                    {hasPin ? "Change Transaction PIN" : "Set Transaction PIN"}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    This 4-digit PIN is separate from your password — you'll enter it before every purchase to protect your wallet.
                </p>

                {hasPin === null ? (

                    <p className="text-gray-500 dark:text-gray-400">Loading...</p>

                ) : (

                    <>

                        {hasPin && (
                            <div className="mb-5">
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    placeholder="Current PIN"
                                    value={currentPin}
                                    onChange={(e) => setCurrentPin(onlyDigits(e.target.value))}
                                    maxLength={4}
                                    className="w-full border dark:border-slate-700 rounded-xl p-4 dark:bg-slate-800 dark:text-white text-center tracking-[0.5em] text-xl"
                                />
                            </div>
                        )}

                        <div className="mb-5">
                            <input
                                type="password"
                                inputMode="numeric"
                                placeholder="New PIN"
                                value={newPin}
                                onChange={(e) => setNewPin(onlyDigits(e.target.value))}
                                maxLength={4}
                                className="w-full border dark:border-slate-700 rounded-xl p-4 dark:bg-slate-800 dark:text-white text-center tracking-[0.5em] text-xl"
                            />
                        </div>

                        <div className="mb-6">
                            <input
                                type="password"
                                inputMode="numeric"
                                placeholder="Confirm New PIN"
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(onlyDigits(e.target.value))}
                                maxLength={4}
                                className="w-full border dark:border-slate-700 rounded-xl p-4 dark:bg-slate-800 dark:text-white text-center tracking-[0.5em] text-xl"
                            />
                        </div>

                    </>

                )}

                <div className="flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-gray-400 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || hasPin === null}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white"
                    >
                        {loading ? "Saving..." : "Save PIN"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default SetTransactionPinModal;
