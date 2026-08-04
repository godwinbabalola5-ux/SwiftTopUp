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

        }

    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setSettings({
            ...settings,
            [name]: type === "checkbox" ? checked : value
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

            toast.error("Failed to update settings");

        }

    };

    return (

        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1 p-8">

                <h1 className="text-4xl font-bold mb-8">
                    ⚙️ Admin Settings
                </h1>

                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">

                    <div>

                        <label className="font-semibold">
                            Company Name
                        </label>

                        <input
                            name="company_name"
                            value={settings.company_name}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3 mt-2"
                        />

                    </div>

                    <div>

                        <label className="font-semibold">
                            Support Email
                        </label>

                        <input
                            name="support_email"
                            value={settings.support_email}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3 mt-2"
                        />

                    </div>

                    <div>

                        <label className="font-semibold">
                            Support Phone
                        </label>

                        <input
                            name="support_phone"
                            value={settings.support_phone}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3 mt-2"
                        />

                    </div>

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
                                className="w-full border rounded-xl p-3 mt-2"
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
                                className="w-full border rounded-xl p-3 mt-2"
                            />

                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-4">

                        {[
                            "airtime_enabled",
                            "data_enabled",
                            "cable_enabled",
                            "electricity_enabled",
                            "maintenance_mode"
                        ].map(item => (

                            <label
                                key={item}
                                className="flex items-center justify-between border rounded-xl p-4"
                            >

                                <span className="capitalize">

                                    {item.replaceAll("_"," ")}

                                </span>

                                <input
                                    type="checkbox"
                                    name={item}
                                    checked={settings[item]}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />

                            </label>

                        ))}

                    </div>

                    <button
                        onClick={saveSettings}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700"
                    >

                        Save Settings

                    </button>

                </div>

            </div>

        </div>

    );

}

export default AdminSettings;