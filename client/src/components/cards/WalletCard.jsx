import { useState } from "react";
import { FaEye, FaEyeSlash, FaWallet } from "react-icons/fa";

function WalletCard({ balance }) {

    const [showBalance, setShowBalance] = useState(true);

    return (

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white shadow-2xl p-8 mt-8">

            {/* Background Glow */}

            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">

                <div className="flex justify-between items-center">

                    <div>

                        <h2 className="text-3xl font-bold">
                            SwiftTopUp
                        </h2>

                        <p className="text-blue-200 mt-1">
                            Premium Wallet
                        </p>

                    </div>

                    <FaWallet size={40} />

                </div>

                <div className="mt-10">

                    <p className="text-blue-200">
                        Available Balance
                    </p>

                    <div className="flex items-center gap-4 mt-2">

                        <h1 className="text-5xl font-extrabold">

                            {showBalance
                                ? `₦${Number(balance).toLocaleString()}`
                                : "₦ ********"}

                        </h1>

                        <button

                            onClick={() =>
                                setShowBalance(!showBalance)
                            }

                            className="bg-white/20 hover:bg-white/30 p-3 rounded-full"

                        >

                            {showBalance
                                ? <FaEyeSlash />
                                : <FaEye />}

                        </button>

                    </div>

                </div>

                <div className="flex justify-between mt-10">

                    <div>

                        <p className="text-blue-200 text-sm">
                            Status
                        </p>

                        <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                            ACTIVE
                        </span>

                    </div>

                    <div>

                        <p className="text-blue-200 text-sm">
                            Cashback
                        </p>

                        <h3 className="font-bold">
                            2%
                        </h3>

                    </div>

                </div>

                <div className="mt-10 flex justify-between items-end">

                    <div>

                        <p className="text-blue-200 text-xs">
                            CARD NUMBER
                        </p>

                        <h2 className="tracking-[6px] text-xl">
                            **** **** **** 4823
                        </h2>

                    </div>

                    <div className="text-right">

                        <h2 className="text-2xl font-black italic">
                            SWIFT
                        </h2>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default WalletCard;