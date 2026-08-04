import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";

function AdminTransactionDetails() {

    const { id } = useParams();

    const [transaction, setTransaction] = useState(null);

    useEffect(() => {

        loadTransaction();

    }, []);

    const loadTransaction = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                `/admin/transactions/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTransaction(response.data.transaction);

        } catch (err) {

            console.log(err);

        }

    };

    if (!transaction) {

        return (
            <div className="p-10 text-xl">
                Loading...
            </div>
        );

    }

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">

            <Sidebar />

            <div className="flex-1 p-10 text-gray-900 dark:text-white">

                <h1 className="text-4xl font-bold mb-8">

                    Transaction Details

                </h1>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-6">

                    <Detail label="Reference" value={transaction.reference} />
                    <Detail label="Type" value={transaction.type} />
                    <Detail label="Customer" value={transaction.customer} />
                    <Detail label="Provider" value={transaction.provider} />
                    <Detail label="Amount" value={`₦${Number(transaction.amount).toLocaleString()}`} />
                    <Detail label="Status" value={transaction.status} />
                    <Detail label="Date" value={new Date(transaction.created_at).toLocaleString()} />

                    <div>

                        <h3 className="font-bold mb-3">

                            API Response

                        </h3>

                        <pre className="bg-gray-100 dark:bg-slate-900 p-5 rounded-xl overflow-auto text-sm text-gray-800 dark:text-gray-200">

                            {transaction.response}

                        </pre>

                    </div>

                </div>

            </div>

        </div>

    );

}

function Detail({ label, value }) {

    return (

        <div className="flex justify-between border-b pb-3">

            <span className="font-semibold">

                {label}

            </span>

            <span>

                {value}

            </span>

        </div>

    );

}

export default AdminTransactionDetails;