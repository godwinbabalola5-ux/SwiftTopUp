import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import {
    FaSearch,
    FaArrowUp,
    FaArrowDown,
    FaHistory
} from "react-icons/fa";

function AdminWalletHistory() {

    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {

        loadHistory();

    }, []);

    const loadHistory = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/wallet/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setHistory(response.data.history);

        } catch (err) {

            console.log(err);

        }

    };

    const filteredHistory = history.filter(item => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            (item.customer || "")
                .toLowerCase()
                .includes(searchText) ||

            (item.admin || "")
                .toLowerCase()
                .includes(searchText) ||

            (item.reason || "")
                .toLowerCase()
                .includes(searchText);

        const matchesFilter =
            filter === "all"
                ? true
                : item.type === filter;

        return matchesSearch && matchesFilter;

    });

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">

            <Sidebar />

            <div className="flex-1 p-8">

                {/* Header */}

                <div className="mb-8">

                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">

                        <FaHistory className="text-blue-600" />

                        Wallet Adjustment History

                    </h1>

                    <p className="text-gray-500 dark:text-gray-400 mt-2">

                        View every credit and debit made by administrators.

                    </p>

                </div>

                {/* Search + Filter */}

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 mb-8 flex flex-col md:flex-row gap-4">

                    <div className="relative flex-1">

                        <FaSearch className="absolute left-4 top-4 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search customer, admin or reason..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-5 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    >

                        <option value="all">
                            All Adjustments
                        </option>

                        <option value="credit">
                            Credits
                        </option>

                        <option value="debit">
                            Debits
                        </option>

                    </select>

                </div>

                {/* Statistics */}

                <div className="grid md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                        <p className="text-gray-500 dark:text-gray-400">
                            Total Adjustments
                        </p>

                        <h2 className="text-3xl font-bold text-blue-600 mt-3">
                            {filteredHistory.length}
                        </h2>

                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                        <p className="text-gray-500 dark:text-gray-400">
                            Credits
                        </p>

                        <h2 className="text-3xl font-bold text-green-600 mt-3">

                            {filteredHistory.filter(
                                item => item.type === "credit"
                            ).length}

                        </h2>

                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

                        <p className="text-gray-500 dark:text-gray-400">
                            Debits
                        </p>

                        <h2 className="text-3xl font-bold text-red-600 mt-3">

                            {filteredHistory.filter(
                                item => item.type === "debit"
                            ).length}

                        </h2>

                    </div>

                </div>

                {/* Table */}

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-blue-600 text-white">

                                <tr>

                                    <th className="p-5 text-left">
                                        Customer
                                    </th>

                                    <th className="text-left">
                                        Admin
                                    </th>

                                    <th className="text-left">
                                        Type
                                    </th>

                                    <th className="text-left">
                                        Amount
                                    </th>

                                    <th className="text-left">
                                        Reason
                                    </th>

                                    <th className="text-left">
                                        Date
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredHistory.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center py-20 text-gray-500 dark:text-gray-400"
                                        >

                                            No wallet adjustments found.

                                        </td>

                                    </tr>

                                ) : (

                                    filteredHistory.map(item => (

                                        <tr
                                            key={item.id}
                                            className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                                        >

                                            <td className="p-5 font-semibold text-gray-900 dark:text-white">

                                                {item.customer}

                                            </td>

                                            <td className="text-gray-700 dark:text-gray-300">

                                                {item.admin}

                                            </td>

                                            <td>

                                                {item.type === "credit" ? (

                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold">

                                                        <FaArrowUp />

                                                        Credit

                                                    </span>

                                                ) : (

                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold">

                                                        <FaArrowDown />

                                                        Debit

                                                    </span>

                                                )}

                                            </td>

                                            <td
                                                className={`font-bold ${
                                                    item.type === "credit"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >

                                                {item.type === "credit"
                                                    ? "+"
                                                    : "-"
                                                }

                                                ₦{Number(
                                                    item.amount
                                                ).toLocaleString()}

                                            </td>

                                            <td className="text-gray-600 dark:text-gray-300">

                                                {item.reason || "No reason provided"}

                                            </td>

                                            <td className="text-gray-500 dark:text-gray-400">

                                                {new Date(
                                                    item.created_at
                                                ).toLocaleString()}

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminWalletHistory;