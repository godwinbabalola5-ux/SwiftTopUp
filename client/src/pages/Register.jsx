import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaBolt } from "react-icons/fa";

import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {

            setLoading(true);

            await api.post("/users/register", {
                fullname,
                email,
                phone,
                password,
                referralCode
            });

            toast.success("Registration Successful");
            navigate("/login");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Registration Failed"
            );

        } finally {
            setLoading(false);
        }

    };

    return (

        <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">

            {/* LEFT */}

            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white items-center justify-center p-16">

                <div>

                    <h1 className="text-6xl font-extrabold">
                        SwiftTopUp
                    </h1>

                    <p className="text-2xl mt-5">
                        Join thousands of users enjoying fast digital payments.
                    </p>

                    <div className="mt-10 space-y-4 text-lg">

                        <p>✅ Secure Wallet</p>
                        <p>✅ Instant Airtime</p>
                        <p>✅ Affordable Data</p>
                        <p>✅ Electricity Bills</p>
                        <p>✅ Cable TV</p>
                        <p>✅ Transaction History</p>

                    </div>

                </div>

            </div>

            {/* RIGHT */}

            <div className="flex-1 flex justify-center items-center p-6">

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg p-10">

                    {/* Logo */}

                    <div className="flex justify-center mb-5">

                        <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">

                            <FaBolt className="text-white text-4xl"/>

                        </div>

                    </div>

                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">

                        Create Account

                    </h2>

                    <p className="text-center text-gray-500 dark:text-gray-400 mt-3">

                        Start using SwiftTopUp today.

                    </p>

                    <form
                        onSubmit={handleRegister}
                        className="space-y-5 mt-8"
                    >

                        {/* Full Name */}

                        <div>

                            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={fullname}
                                onChange={(e)=>setFullname(e.target.value)}
                                placeholder="John Doe"
                                className="w-full p-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                required
                            />

                        </div>

                        {/* Email */}

                        <div>

                            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className="w-full p-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                required
                            />

                        </div>

                        {/* Phone */}

                        <div>

                            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Phone Number
                            </label>

                            <input
                                type="text"
                                value={phone}
                                onChange={(e)=>setPhone(e.target.value)}
                                placeholder="08012345678"
                                className="w-full p-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                required
                            />

                        </div>

                        {/* Referral */}

                        <div>

                            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Referral Code (Optional)
                            </label>

                            <input
                                type="text"
                                value={referralCode}
                                onChange={(e)=>setReferralCode(e.target.value)}
                                placeholder="Enter referral code"
                                className="w-full p-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />

                        </div>

                        {/* Password */}

                        <div>

                            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full p-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={()=>setShowPassword(!showPassword)}
                                    className="absolute right-4 top-5 text-gray-500 hover:text-blue-600 transition"
                                >

                                    {showPassword ? <FaEyeSlash/> : <FaEye/>}

                                </button>

                            </div>

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Confirm Password
                            </label>

                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className="w-full p-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 ${
                                loading
                                    ? "bg-gray-500"
                                    : "bg-blue-700 hover:bg-blue-800 hover:scale-[1.02]"
                            }`}
                        >

                            {loading ? "Creating Account..." : "Create Account"}

                        </button>

                    </form>

                    <div className="text-center mt-8 text-gray-700 dark:text-gray-300">

                        Already have an account?

                        <Link
                            to="/login"
                            className="text-blue-600 font-bold ml-2 hover:underline"
                        >
                            Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;