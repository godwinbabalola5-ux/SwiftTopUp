import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";

import {
    FaSearch,
    FaFileExcel,
    FaFilePdf,
    FaExchangeAlt,
    FaCheckCircle,
    FaClock,
    FaMoneyBillWave,
    FaFilter,
    FaEye
} from "react-icons/fa";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminTransactions() {

    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [service, setService] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    useEffect(() => {

        loadTransactions();

    }, []);

    const loadTransactions = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/admin/transactions", {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

            setTransactions(response.data.transactions);

        } catch (err) {

            console.log(err);

        }

    };

    const filteredTransactions = transactions.filter(item => {

        const matchesSearch =

            (item.reference || "")
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            (item.customer || "")
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            (item.type || "")
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesService =

            service === "all"

                ? true

                : item.type === service;

        return matchesSearch && matchesService;

    });

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const currentTransactions = filteredTransactions.slice(

        (currentPage - 1) * itemsPerPage,

        currentPage * itemsPerPage

    );

    const badgeColor = (status) => {

        switch (status) {

            case "success":

                return "bg-green-100 text-green-700";

            case "pending":

                return "bg-yellow-100 text-yellow-700";

            default:

                return "bg-red-100 text-red-700";

        }

    };

    const serviceColor = (type) => {

        switch (type) {

            case "airtime":

                return "bg-blue-100 text-blue-700";

            case "data":

                return "bg-cyan-100 text-cyan-700";

            case "electricity":

                return "bg-yellow-100 text-yellow-700";

            case "cable":

                return "bg-purple-100 text-purple-700";

            default:

                return "bg-green-100 text-green-700";

        }

    };

   const exportToExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(

            filteredTransactions.map(item => ({

                Reference: item.reference,

                Customer: item.customer,

                Service: item.type,

                Amount: item.amount,

                Status: item.status,

                Date: new Date(item.created_at).toLocaleString()

            }))

        );

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

        const excel = XLSX.write(workbook, {

            bookType: "xlsx",

            type: "array"

        });

        saveAs(

            new Blob([excel]),

            "SwiftTopUp_Transactions.xlsx"

        );

    };

    const exportPDF = () => {

        const doc = new jsPDF();

        doc.setFontSize(22);

        doc.text("SwiftTopUp", 14, 18);

        autoTable(doc, {

            startY: 28,

            head: [[

                "Reference",

                "Customer",

                "Service",

                "Amount",

                "Status",

                "Date"

            ]],

            body: filteredTransactions.map(item => [

                item.reference,

                item.customer,

                item.type,

                `₦${Number(item.amount).toLocaleString()}`,

                item.status,

                new Date(item.created_at).toLocaleString()

            ])

        });

        doc.save("SwiftTopUp_Transactions.pdf");

    };

   return (

<div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">

    <Sidebar />

    <div className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">

            <div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">

                    <FaExchangeAlt className="text-blue-600" />

                    Transaction Management

                </h1>

                <p className="text-gray-500 dark:text-gray-400 mt-2">

                    Monitor every transaction happening on SwiftTopUp

                </p>

            </div>

        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 mb-8 flex flex-col lg:flex-row gap-4 justify-between transition-colors">

            <div className="relative flex-1">

                <FaSearch className="absolute left-4 top-4 text-gray-400" />

                <input

                    type="text"

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                    placeholder="Search transaction..."

                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"

                />

            </div>

            <div className="flex gap-3">

                <button

                    onClick={exportToExcel}

                    className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-xl flex items-center gap-2"

                >

                    <FaFileExcel />

                    Excel

                </button>

                <button

                    onClick={exportPDF}

                    className="bg-red-600 hover:bg-red-700 text-white px-5 rounded-xl flex items-center gap-2"

                >

                    <FaFilePdf />

                    PDF

                </button>

            </div>

        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 transition-colors">

                <FaExchangeAlt className="text-blue-600 text-3xl"/>

                <p className="text-gray-500 dark:text-gray-400 mt-4">

                    Total Transactions

                </p>

                <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">

                    {filteredTransactions.length}

                </h2>

            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 transition-colors">

                <FaCheckCircle className="text-green-600 text-3xl"/>

                <p className="text-gray-500 dark:text-gray-400 mt-4">

                    Successful

                </p>

                <h2 className="text-3xl font-bold mt-2 text-green-600">

                    {

                        filteredTransactions.filter(

                            item=>item.status==="success"

                        ).length

                    }

                </h2>

            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 transition-colors">

                <FaClock className="text-yellow-500 text-3xl"/>

                <p className="text-gray-500 dark:text-gray-400 mt-4">

                    Pending

                </p>

                <h2 className="text-3xl font-bold mt-2 text-yellow-500">

                    {

                        filteredTransactions.filter(

                            item=>item.status==="pending"

                        ).length

                    }

                </h2>

            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 transition-colors">

                <FaMoneyBillWave className="text-purple-600 text-3xl"/>

                <p className="text-gray-500 dark:text-gray-400 mt-4">

                    Revenue

                </p>

                <h2 className="text-3xl font-bold mt-2 text-purple-600">

                    ₦{

                        filteredTransactions

                        .filter(item=>item.status==="success")

                        .reduce(

                            (sum,item)=>sum+Number(item.amount),

                            0

                        )

                        .toLocaleString()

                    }

                </h2>

            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">

    <table className="w-full">

        <thead className="bg-blue-600 text-white">

            <tr>

                <th className="p-5 text-left">Reference</th>

                <th className="text-left">Customer</th>

                <th className="text-left">Service</th>

                <th className="text-left">Amount</th>

                <th className="text-left">Status</th>

                <th className="text-left">Date</th>

            </tr>

        </thead>

        <tbody>

            {

                filteredTransactions.length === 0 ?

                (

                    <tr>

                        <td
                            colSpan="6"
                            className="text-center py-20 text-gray-500 dark:text-gray-400"
                        >

                            No Transactions Found

                        </td>

                    </tr>

                )

                :

                filteredTransactions.map((item)=>(

                    <tr

                        key={item.id}

                        onClick={()=>navigate(`/admin/transactions/${item.id}`)}

                        className="cursor-pointer border-b border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"

                    >

                        <td className="p-5 font-semibold text-blue-600">

                            {item.reference}

                        </td>

                        <td className="text-gray-800 dark:text-gray-200">

                            {item.customer}

                        </td>

                        <td>

                            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 capitalize">

                                {item.type}

                            </span>

                        </td>

                        <td className="font-bold text-gray-900 dark:text-white">

                            ₦{Number(item.amount).toLocaleString()}

                        </td>

                        <td>

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(item.status)}`}
                            >

                                {item.status}

                            </span>

                        </td>

                        <td className="text-gray-500 dark:text-gray-400">

                            {new Date(item.created_at).toLocaleString()}

                        </td>

                    </tr>

                ))

            }

        </tbody>

    </table>

</div>

</div>

</div>

);

}

export default AdminTransactions;