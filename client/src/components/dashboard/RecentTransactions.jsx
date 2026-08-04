import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { ThemeContext } from "../../context/ThemeContext";

function RecentTransactions() {

    const { darkMode } = useContext(ThemeContext);

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/recent-transactions", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTransactions(response.data.transactions);

        } catch (err) {

            console.log(err);

        }

    };

    const getIcon = (type) => {

        switch (type) {

            case "fund":
                return "💰";

            case "airtime":
                return "📱";

            case "data":
                return "🌐";

            case "electricity":
                return "⚡";

            case "cable":
                return "📺";

            default:
                return "💳";

        }

    };

    return (

        <div
            className={`rounded-2xl shadow-lg p-6 ${
                darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white"
            }`}
        >

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">

                    Recent Activity

                </h2>

                <Link
                    to="/transactions"
                    className="text-blue-600 font-semibold hover:underline"
                >

                    View All

                </Link>

            </div>

            {

                transactions.length === 0 ?

                (

                    <p className={darkMode ? "text-gray-300" : "text-gray-500"}>

                        No recent transactions.

                    </p>

                )

                :

                (

                    transactions.map((item) => (

                        <div
                            key={item.id}
                            className={`flex justify-between items-center py-4 border-b last:border-none ${
                                darkMode
                                    ? "border-gray-700"
                                    : "border-gray-200"
                            }`}
                        >

                            <div className="flex gap-4">

                                <div className="text-3xl">

                                    {getIcon(item.type)}

                                </div>

                                <div>

                                    <h3 className="font-semibold capitalize">

                                        {item.type}

                                    </h3>

                                    <p className={`text-sm ${
                                        darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                    }`}>

                                        {new Date(item.created_at).toLocaleString()}

                                    </p>

                                </div>

                            </div>

                            <div className="text-right">

                                <h3 className="font-bold">

                                    ₦{Number(item.amount).toLocaleString()}

                                </h3>

                                <span
                                    className={`text-sm font-semibold ${
                                        item.status === "success"
                                            ? "text-green-600"
                                            : item.status === "pending"
                                            ? "text-yellow-600"
                                            : "text-red-600"
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

    );

}

export default RecentTransactions;