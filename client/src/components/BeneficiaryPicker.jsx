import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

/**
 * Shows saved beneficiaries (numbers) for a given purchase type as
 * clickable chips, plus a small inline form to save the number
 * currently typed into the form.
 *
 * Props:
 *  - type: "airtime" | "data" | "electricity" | "cable"
 *  - value: the phone/meter/smartcard number currently in the form
 *  - network: the currently selected network/provider/disco (or null —
 *      cable/electricity may not always need this, airtime/data do)
 *  - onSelect(beneficiary): called when the user clicks a saved chip.
 *      beneficiary has { value, network, label }.
 */
function BeneficiaryPicker({ type, value, network, onSelect }) {

    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [label, setLabel] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadBeneficiaries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const loadBeneficiaries = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                `/beneficiaries?type=${type}`
            );

            setBeneficiaries(response.data.beneficiaries || []);

        } catch (error) {

            // Failing to load saved beneficiaries shouldn't block the
            // purchase form itself — just show an empty list quietly.
            console.log("LOAD BENEFICIARIES ERROR:", error);

        } finally {

            setLoading(false);

        }

    };

    const handleSave = async () => {

        if (!value || !value.trim()) {
            toast.error("Enter a number before saving it.");
            return;
        }

        if (!label.trim()) {
            toast.error("Give this number a label first.");
            return;
        }

        try {

            setSaving(true);

            const response = await api.post(
                "/beneficiaries",
                {
                    type,
                    label: label.trim(),
                    value: value.trim(),
                    network: network || null
                }
            );

            toast.success("Number saved.");

            setBeneficiaries((prev) => [
                response.data.beneficiary,
                ...prev
            ]);

            setLabel("");
            setShowSaveForm(false);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to save this number."
            );

        } finally {

            setSaving(false);

        }

    };

    const handleDelete = async (id, e) => {

        // Stop the click from also triggering the chip's onSelect.
        e.stopPropagation();

        try {

            await api.delete(`/beneficiaries/${id}`);

            setBeneficiaries((prev) =>
                prev.filter((b) => b.id !== id)
            );

        } catch (error) {

            toast.error("Unable to remove this number.");

        }

    };

    if (loading) {
        return null; // avoid a layout flash while the list loads
    }

    return (
        <div className="mb-4">

            {beneficiaries.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">

                    {beneficiaries.map((b) => (
                        <button
                            key={b.id}
                            type="button"
                            onClick={() => onSelect(b)}
                            className="group flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
                        >
                            <span className="font-medium">{b.label}</span>
                            <span className="text-blue-400 dark:text-blue-500">
                                {b.value}
                            </span>
                            <span
                                onClick={(e) => handleDelete(b.id, e)}
                                className="text-blue-300 hover:text-red-500 dark:text-blue-600 dark:hover:text-red-400 ml-1"
                                title="Remove"
                            >
                                ×
                            </span>
                        </button>
                    ))}

                </div>
            )}

            {!showSaveForm ? (

                <button
                    type="button"
                    onClick={() => setShowSaveForm(true)}
                    disabled={!value || !value.trim()}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                >
                    + Save this number
                </button>

            ) : (

                <div className="flex items-center gap-2 mt-1">

                    <input
                        type="text"
                        placeholder="Label, e.g. My phone"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="flex-1 border rounded-lg p-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        autoFocus
                    />

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setShowSaveForm(false);
                            setLabel("");
                        }}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
                    >
                        Cancel
                    </button>

                </div>

            )}

        </div>
    );

}

export default BeneficiaryPicker;
