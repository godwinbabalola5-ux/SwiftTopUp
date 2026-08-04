import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import { ThemeContext } from "../context/ThemeContext";

function Wallet() {

    const { darkMode } = useContext(ThemeContext);

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        loadProfile();
        loadTransactions();

    }, []);

    const loadProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(response.data.profile);

        } catch (error) {

            console.log(error);

        }

    };

    const loadTransactions = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/transactions", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const fundingTransactions = response.data.transactions.filter(
                (item) => item.type === "fund"
            );

            setTransactions(fundingTransactions);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div
            className={`flex min-h-screen ${
                darkMode
                    ? "bg-gray-900"
                    : "bg-gray-100"
            }`}
        >

            <Sidebar />

            <div className="flex-1 p-8">

                <h1
                    className={`text-4xl font-bold mb-8 ${
                        darkMode
                            ? "text-white"
                            : "text-gray-900"
                    }`}
                >

                    Wallet

                </h1>

                <div
                    className={`rounded-2xl shadow-lg text-white p-8 ${
                        darkMode
                            ? "bg-gradient-to-r from-gray-800 to-gray-900"
                            : "bg-gradient-to-r from-green-600 to-green-500"
                    }`}
                >

                    <p className="text-lg">

                        Available Balance

                    </p>

                    <h2 className="text-5xl font-bold mt-3">

                        ₦{Number(user?.wallet || 0).toLocaleString()}

                    </h2>

                    <button
                        onClick={() => navigate("/fund-wallet")}
                        className={`mt-6 px-6 py-3 rounded-lg font-bold transition ${
                            darkMode
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-white text-green-600 hover:bg-gray-100"
                        }`}
                    >

                        Fund Wallet

                    </button>

                </div>

                <div
                    className={`rounded-2xl shadow-lg mt-10 p-6 ${
                        darkMode
                            ? "bg-gray-800 text-white"
                            : "bg-white"
                    }`}
                >

                    <h2 className="text-2xl font-bold mb-6">

                        Recent Funding

                    </h2>

                    {

                        transactions.length === 0 ?

                        (

                            <div
                                className={`text-center py-10 ${
                                    darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                }`}
                            >

                                No funding transaction found.

                            </div>

                        )

                        :

                        (

                            transactions.map((item) => (

                                <div
                                    key={item.id}
                                    className={`flex justify-between items-center py-5 border-b last:border-none ${
                                        darkMode
                                            ? "border-gray-700"
                                            : "border-gray-200"
                                    }`}
                                >

                                    <div>

                                        <h3 className="font-bold text-lg">

                                            💰 Wallet Funding

                                        </h3>

                                        <p
                                            className={`text-sm mt-1 ${
                                                darkMode
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                            }`}
                                        >

                                            Ref: {item.reference}

                                        </p>

                                        <p
                                            className={`text-xs mt-1 ${
                                                darkMode
                                                    ? "text-gray-500"
                                                    : "text-gray-400"
                                            }`}
                                        >

                                            {new Date(item.created_at).toLocaleString()}

                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <h3 className="text-green-500 text-xl font-bold">

                                            +₦{Number(item.amount).toLocaleString()}

                                        </h3>

                                        <span
                                            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                                darkMode
                                                    ? "bg-green-900 text-green-300"
                                                    : "bg-green-100 text-green-700"
                                            }`}
                                        >

                                            {item.status}

                                        </span>

                                    </div>

                                </div>

                            ))

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default Wallet;