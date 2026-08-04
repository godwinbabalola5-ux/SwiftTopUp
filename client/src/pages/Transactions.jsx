import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";

function Transactions() {

    const [transactions, setTransactions] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadTransactions();
    }, []);

    useEffect(() => {

        let data = [...transactions];

        if (filter !== "all") {
            data = data.filter(item => item.type === filter);
        }

        if (search.trim() !== "") {

            data = data.filter(item =>
                item.reference.toLowerCase().includes(search.toLowerCase())
            );

        }

        setFiltered(data);

    }, [transactions, search, filter]);

    const loadTransactions = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/transactions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTransactions(response.data.transactions);

        } catch (error) {

            console.log(error);

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

    const statusColor = (status) => {

        switch (status) {

            case "success":
                return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";

            case "pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";

            default:
                return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

        }

    };

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">

            <Sidebar />

            <div className="flex-1 p-8 text-gray-900 dark:text-white">

                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">

                    <h1 className="text-4xl font-bold">
                        Transaction History
                    </h1>

                    <div className="flex gap-3">

                        <input
                            type="text"
                            placeholder="Search Reference..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border rounded-lg px-4 py-3 w-64 bg-white dark:bg-gray-800"
                        />

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border rounded-lg px-4 py-3 bg-white dark:bg-gray-800"
                        >

                            <option value="all">All</option>
                            <option value="fund">Wallet</option>
                            <option value="airtime">Airtime</option>
                            <option value="data">Data</option>
                            <option value="electricity">Electricity</option>
                            <option value="cable">Cable</option>

                        </select>

                    </div>

                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">

                    {filtered.length === 0 ? (

                        <div className="text-center py-20">

                            <div className="text-7xl">📭</div>

                            <h2 className="text-3xl font-bold mt-5">
                                No Transactions Found
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Your completed transactions will appear here.
                            </p>

                        </div>

                    ) : (

                        filtered.map((item) => (

                            <div
                                key={item.id}
                                className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >

                                <div className="flex items-center gap-5">

                                    <div className="text-5xl">
                                        {getIcon(item.type)}
                                    </div>

                                    <div>

                                        <h2 className="font-bold text-xl capitalize">
                                            {item.type}
                                        </h2>

                                        <p className="text-gray-500">
                                            {item.reference}
                                        </p>

                                        <p className="text-sm text-gray-400">
                                            {new Date(item.created_at).toLocaleString()}
                                        </p>

                                    </div>

                                </div>

                                <div className="text-right mt-5 md:mt-0">

                                    <h2 className="text-2xl font-bold text-blue-600">
                                        ₦{Number(item.amount).toLocaleString()}
                                    </h2>

                                    <span
                                        className={`inline-block mt-2 px-4 py-2 rounded-full font-semibold ${statusColor(item.status)}`}
                                    >
                                        {item.status.toUpperCase()}
                                    </span>

                                    {item.refund_status === "pending" && (
                                        <div className="mt-2 text-yellow-500 font-semibold">
                                            Refund Pending
                                        </div>
                                    )}

                                    {item.refund_status === "refunded" && (
                                        <div className="mt-2 text-green-500 font-semibold">
                                            Refunded
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-4 justify-end flex-wrap">

                                        <Link
                                            to={`/receipt/${item.id}`}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
                                        >
                                            View Receipt
                                        </Link>

                                        {item.status === "failed" &&
                                            item.refund_status === "none" && (

                                                <Link
                                                    to={`/refund/${item.id}`}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg"
                                                >
                                                    Request Refund
                                                </Link>

                                            )}

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );

}

export default Transactions;