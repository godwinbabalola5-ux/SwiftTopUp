import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import { toast } from "react-hot-toast";

function AdminSettings() {

    const [settings, setSettings] = useState({
        company_name: "",
        support_email: "",
        support_phone: "",

        minimum_funding: 100,
        maximum_funding: 100000,

        airtime_markup: 0,
        data_markup: 0,
        cable_markup: 0,
        electricity_markup: 0,
        deposit_fee: 0,

        airtime_enabled: true,
        data_enabled: true,
        cable_enabled: true,
        electricity_enabled: true,
        maintenance_mode: false
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/settings", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSettings(response.data.settings);

        } catch (err) {

            console.log(err);

            toast.error("Unable to load settings.");

        }

    };

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setSettings({
            ...settings,
            [name]: type === "checkbox"
                ? checked
                : value
        });

    };

    const saveSettings = async () => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                "/settings",
                settings,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Settings Updated Successfully");

        } catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Failed to update settings"
            );

        }

    };

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">

            <Sidebar />

            <div className="flex-1 p-8 text-gray-900 dark:text-white">

                <h1 className="text-4xl font-bold mb-8">
                    ⚙️ Admin Settings
                </h1>


                {/* COMPANY INFORMATION */}

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Company Information
                    </h2>

                    <div className="space-y-5">

                        <div>

                            <label className="font-semibold">
                                Company Name
                            </label>

                            <input
                                name="company_name"
                                value={settings.company_name || ""}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3 mt-2 dark:bg-gray-800 dark:border-gray-700"
                            />

                        </div>


                        <div>

                            <label className="font-semibold">
                                Support Email
                            </label>

                            <input
                                type="email"
                                name="support_email"
                                value={settings.support_email || ""}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3 mt-2 dark:bg-gray-800 dark:border-gray-700"
                            />

                        </div>


                        <div>

                            <label className="font-semibold">
                                Support Phone
                            </label>

                            <input
                                name="support_phone"
                                value={settings.support_phone || ""}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3 mt-2 dark:bg-gray-800 dark:border-gray-700"
                            />

                        </div>

                    </div>

                </div>


                {/* WALLET FUNDING */}

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-6">
                        💰 Wallet Funding
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <label className="font-semibold">
                                Minimum Funding
                            </label>

                            <input
                                type="number"
                                name="minimum_funding"
                                value={settings.minimum_funding}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3 mt-2 dark:bg-gray-800 dark:border-gray-700"
                            />

                        </div>


                        <div>

                            <label className="font-semibold">
                                Maximum Funding
                            </label>

                            <input
                                type="number"
                                name="maximum_funding"
                                value={settings.maximum_funding}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3 mt-2 dark:bg-gray-800 dark:border-gray-700"
                            />

                        </div>

                    </div>


                    <div className="mt-6">

                        <label className="font-semibold">
                            Deposit Fee
                        </label>

                        <input
                            type="number"
                            name="deposit_fee"
                            value={settings.deposit_fee}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full border rounded-xl p-3 mt-2 dark:bg-gray-800 dark:border-gray-700"
                        />

                        <p className="text-sm text-gray-500 mt-2">
                            Amount charged when a user funds their wallet.
                        </p>

                    </div>

                </div>


                {/* SERVICE MARKUPS */}

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-2">
                        📈 Service Markups
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Set the amount you want SwiftTopUp to add to each service.
                    </p>


                    <div className="grid md:grid-cols-2 gap-6">


                        <div>

                            <label className="font-semibold">
                                Airtime Markup
                            </label>

                            <input
                                type="number"
                                name="airtime_markup"
                                value={settings.airtime_markup}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full border rounded-xl p-3 mt-2 dark:bg-gray-800 dark:border-gray-700"
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Example: ₦350 instead of ₦300.
                            </p>

                        </div>


                        <div>

                            <label className="font-semibold">
                                Data Markup
                            </label>

                            <input
                                type="number"
                                name="data_markup"
                                value={settings.data_markup}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full border rounded-xl p-3 mt-2 dark:bg-gray-800 dark:border-gray-700"
                            />

                        </div>


                        <div>

                            <label className="font-semibold">
                                Cable Markup
                            </label>

                            <input
                                type="number"
                                name="cable_markup"
                                value={settings.cable_markup}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full border rounded-xl p-3 mt-2 dark:bg-gray-800 dark:border-gray-700"
                            />

                        </div>


                        <div>

                            <label className="font-semibold">
                                Electricity Markup
                            </label>

                            <input
                                type="number"
                                name="electricity_markup"
                                value={settings.electricity_markup}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full border rounded-xl p-3 mt-2 dark:bg-gray-800 dark:border-gray-700"
                            />

                        </div>

                    </div>

                </div>


                {/* SERVICE CONTROLS */}

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-6">
                        🔧 Service Controls
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">

                        {[
                            "airtime_enabled",
                            "data_enabled",
                            "cable_enabled",
                            "electricity_enabled",
                            "maintenance_mode"
                        ].map((item) => (

                            <label
                                key={item}
                                className="flex items-center justify-between border rounded-xl p-4 dark:border-gray-700"
                            >

                                <span className="capitalize">

                                    {item.replaceAll("_", " ")}

                                </span>

                                <input
                                    type="checkbox"
                                    name={item}
                                    checked={Boolean(settings[item])}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />

                            </label>

                        ))}

                    </div>

                </div>


                {/* SAVE BUTTON */}

                <button
                    onClick={saveSettings}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition"
                >

                    Save Settings

                </button>

            </div>

        </div>

    );

}

export default AdminSettings;