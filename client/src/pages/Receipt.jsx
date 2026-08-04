import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";

function Receipt() {

    const { id } = useParams();

    const [receipt, setReceipt] = useState(null);

    useEffect(() => {

        loadReceipt();

    }, []);

    const loadReceipt = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(

                `/transactions/${id}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setReceipt(response.data.transaction);

        }

        catch (error) {

            console.log(error);

        }

    };

    const downloadPDF = () => {

        const pdf = new jsPDF();

        pdf.setFontSize(22);
        pdf.text("SwiftTopUp", 70, 20);

        pdf.setFontSize(15);
        pdf.text("Transaction Receipt", 60, 32);

        pdf.line(20, 38, 190, 38);

        pdf.setFontSize(12);

        pdf.text(`Reference: ${receipt.reference}`, 20, 50);

        pdf.text(`Service: ${receipt.type}`, 20, 62);

        pdf.text(`Amount: ₦${Number(receipt.amount).toLocaleString()}`, 20, 74);

        pdf.text(`Status: ${receipt.status}`, 20, 86);

        pdf.text(`Provider: ${receipt.provider}`, 20, 98);

        pdf.text(`Customer: ${receipt.customer}`, 20, 110);

        pdf.text(

            `Date: ${new Date(receipt.created_at).toLocaleString()}`,

            20,

            122

        );

        pdf.line(20, 132, 190, 132);

        pdf.text("Thank you for choosing SwiftTopUp.", 45, 145);

        pdf.save(`${receipt.reference}.pdf`);

    };

    if (!receipt) {

        return (

            <div className="flex justify-center items-center h-screen">

                Loading Receipt...

            </div>

        );

    }

    return (

        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1 p-8">

                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">

                    <div className="text-center">

                        <h1 className="text-4xl font-bold text-blue-700">

                            SwiftTopUp

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Official Transaction Receipt

                        </p>

                    </div>

                    <hr className="my-8" />

                    <div className="space-y-5">

                        <div className="flex justify-between">

                            <strong>Reference</strong>

                            <span>{receipt.reference}</span>

                        </div>

                        <div className="flex justify-between">

                            <strong>Service</strong>

                            <span className="capitalize">

                                {receipt.type}

                            </span>

                        </div>

                        <div className="flex justify-between">

                            <strong>Amount</strong>

                            <span>

                                ₦{Number(receipt.amount).toLocaleString()}

                            </span>

                        </div>

                        <div className="flex justify-between">

                            <strong>Provider</strong>

                            <span>{receipt.provider}</span>

                        </div>

                        <div className="flex justify-between">

                            <strong>Customer</strong>

                            <span>{receipt.customer}</span>

                        </div>

                        <div className="flex justify-between">

                            <strong>Date</strong>

                            <span>

                                {new Date(receipt.created_at).toLocaleString()}

                            </span>

                        </div>

                        <div className="flex justify-between">

                            <strong>Status</strong>

                            <span className="text-green-600 font-bold">

                                {receipt.status.toUpperCase()}

                            </span>

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-5 mt-10">

                        <button

                            onClick={() => window.print()}

                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"

                        >

                            Print Receipt

                        </button>

                        <button

                            onClick={downloadPDF}

                            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"

                        >

                            Download PDF

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Receipt;