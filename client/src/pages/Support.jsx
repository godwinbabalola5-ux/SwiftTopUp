import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import {
    FaEnvelope,
    FaPhone,
    FaWhatsapp,
    FaMobileAlt,
    FaWifi,
    FaWallet,
    FaBolt,
    FaTv,
    FaQuestionCircle
} from "react-icons/fa";

function Support() {

    const whatsapp1 =
        "https://wa.me/2347046594823?text=Hello%20SwiftTopUp%20Support,%20I%20need%20assistance.";

    const whatsapp2 =
        "https://wa.me/2348055684139?text=Hello%20SwiftTopUp%20Support,%20I%20need%20assistance.";

    const [supportEmail, setSupportEmail] = useState("");

    useEffect(() => {

        api.get("/settings/public")
            .then((response) => {
                setSupportEmail(response.data.settings?.support_email || "");
            })
            .catch((error) => {
                console.log("LOAD PUBLIC SETTINGS ERROR:", error);
            });

    }, []);

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">

            <Sidebar />

            <div className="flex-1 p-8">

                {/* Header */}

                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl">

                    <h1 className="text-5xl font-bold">

                        Support Center

                    </h1>

                    <p className="mt-4 text-blue-100 text-lg">

                        Need help? Our support team is available to assist you.

                    </p>

                </div>

                {/* Contact Cards */}

                <div className="grid lg:grid-cols-2 gap-8 mt-10">

                    {/* Contact */}

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8">

                        <h2 className="text-3xl font-bold mb-8 dark:text-white">

                            Contact Support

                        </h2>

                        <div className="space-y-6">

                            {/* Email */}

                            <div className="border rounded-2xl p-5 hover:shadow-lg transition">

                                <div className="flex items-center gap-3">

                                    <FaEnvelope className="text-blue-600 text-2xl" />

                                    <div>

                                        <h3 className="font-bold dark:text-white">

                                            Email Support

                                        </h3>

                                        <p className="text-gray-500">

                                            {supportEmail || "Loading..."}

                                        </p>

                                    </div>

                                </div>

                                <a

                                    href={`mailto:${supportEmail}`}

                                    className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"

                                >

                                    Send Email

                                </a>

                            </div>

                            {/* WhatsApp 1 */}

                            <div className="border rounded-2xl p-5 hover:shadow-lg transition">

                                <div className="flex items-center gap-3">

                                    <FaWhatsapp className="text-green-600 text-2xl" />

                                    <div>

                                        <h3 className="font-bold dark:text-white">

                                            WhatsApp Support 1

                                        </h3>

                                        <p className="text-gray-500">

                                            07046594823

                                        </p>

                                    </div>

                                </div>

                                <a

                                    href={whatsapp1}

                                    target="_blank"

                                    rel="noreferrer"

                                    className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"

                                >

                                    Chat Now

                                </a>

                            </div>

                            {/* WhatsApp 2 */}

                            <div className="border rounded-2xl p-5 hover:shadow-lg transition">

                                <div className="flex items-center gap-3">

                                    <FaWhatsapp className="text-green-600 text-2xl" />

                                    <div>

                                        <h3 className="font-bold dark:text-white">

                                            WhatsApp Support 2

                                        </h3>

                                        <p className="text-gray-500">

                                            08055684139

                                        </p>

                                    </div>

                                </div>

                                <a

                                    href={whatsapp2}

                                    target="_blank"

                                    rel="noreferrer"

                                    className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"

                                >

                                    Chat Now

                                </a>

                            </div>

                            {/* Call */}

                            <div className="border rounded-2xl p-5 hover:shadow-lg transition">

                                <div className="flex items-center gap-3">

                                    <FaPhone className="text-orange-500 text-2xl" />

                                    <div>

                                        <h3 className="font-bold dark:text-white">

                                            Call Support

                                        </h3>

                                        <p className="text-gray-500">

                                            09168983323

                                        </p>

                                    </div>

                                </div>

                                <a

                                    href="tel:09168983323"

                                    className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl"

                                >

                                    Call Now

                                </a>

                            </div>

                        </div>

                    </div>

                    {/* Quick Help */}

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8">

                        <h2 className="text-3xl font-bold mb-8 dark:text-white">

                            Quick Help

                        </h2>

                        <div className="grid grid-cols-2 gap-5">

                            <a href={whatsapp1} target="_blank" rel="noreferrer" className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-6 hover:scale-105 transition">
                                <FaMobileAlt className="text-blue-600 text-3xl mb-3" />
                                <h3 className="font-bold dark:text-white">Failed Airtime</h3>
                            </a>

                            <a href={whatsapp1} target="_blank" rel="noreferrer" className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-6 hover:scale-105 transition">
                                <FaWifi className="text-indigo-600 text-3xl mb-3" />
                                <h3 className="font-bold dark:text-white">Failed Data</h3>
                            </a>

                            <a href={whatsapp2} target="_blank" rel="noreferrer" className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-6 hover:scale-105 transition">
                                <FaWallet className="text-green-600 text-3xl mb-3" />
                                <h3 className="font-bold dark:text-white">Wallet Funding</h3>
                            </a>

                            <a href={whatsapp2} target="_blank" rel="noreferrer" className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-6 hover:scale-105 transition">
                                <FaBolt className="text-yellow-500 text-3xl mb-3" />
                                <h3 className="font-bold dark:text-white">Electricity</h3>
                            </a>

                            <a href={whatsapp2} target="_blank" rel="noreferrer" className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-6 hover:scale-105 transition">
                                <FaTv className="text-red-500 text-3xl mb-3" />
                                <h3 className="font-bold dark:text-white">Cable TV</h3>
                            </a>

                            <a href={whatsapp1} target="_blank" rel="noreferrer" className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-6 hover:scale-105 transition">
                                <FaQuestionCircle className="text-purple-600 text-3xl mb-3" />
                                <h3 className="font-bold dark:text-white">Other Complaint</h3>
                            </a>

                        </div>

                    </div>

                </div>

                {/* FAQ */}

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 mt-10">

                    <h2 className="text-3xl font-bold mb-8 dark:text-white">

                        Frequently Asked Questions

                    </h2>

                    <div className="space-y-5">

                        <details className="border rounded-xl p-4">
                            <summary className="font-semibold cursor-pointer">
                                My airtime wasn't delivered.
                            </summary>
                            <p className="mt-3 text-gray-500">
                                Kindly wait a few minutes. If the issue persists, contact our support team immediately.
                            </p>
                        </details>

                        <details className="border rounded-xl p-4">
                            <summary className="font-semibold cursor-pointer">
                                Wallet funded but balance not updated.
                            </summary>
                            <p className="mt-3 text-gray-500">
                                Please provide your payment reference when contacting support.
                            </p>
                        </details>

                        <details className="border rounded-xl p-4">
                            <summary className="font-semibold cursor-pointer">
                                Electricity token not received.
                            </summary>
                            <p className="mt-3 text-gray-500">
                                Kindly wait for a few minutes. If no token arrives, contact support with your meter number.
                            </p>
                        </details>

                        <details className="border rounded-xl p-4">
                            <summary className="font-semibold cursor-pointer">
                                Is SwiftTopUp secure?
                            </summary>
                            <p className="mt-3 text-gray-500">
                                Yes. All payments and transactions are encrypted and securely processed.
                            </p>
                        </details>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Support;