import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();
    const { refreshUser } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            // Login
            const response = await api.post("/users/login", {
                email,
                password
            });

            const token = response.data.token;

            if (rememberMe) {
                localStorage.setItem("token", token);
            } else {
                sessionStorage.setItem("token", token);
                localStorage.setItem("token", token);
            }

            // Load user profile
            await refreshUser();

            // Get profile directly
            const profileResponse = await api.get("/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const profile = profileResponse.data.profile;

            toast.success("Welcome back!");

            if (profile.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex">

            {/* Left Side */}

            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white items-center justify-center p-16">

                <div>

                    <h1 className="text-6xl font-extrabold">
                        SwiftTopUp
                    </h1>

                    <p className="text-2xl mt-6">
                        Fast • Secure • Reliable
                    </p>

                    <div className="mt-12 space-y-5 text-xl">

                        <p>📱 Buy Airtime Instantly</p>

                        <p>🌐 Affordable Data Bundles</p>

                        <p>⚡ Electricity Bills</p>

                        <p>📺 Cable TV Subscription</p>

                        <p>💰 Secure Wallet Funding</p>

                    </div>

                </div>

            </div>

            {/* Right Side */}

            <div className="flex-1 flex items-center justify-center bg-gray-100 p-6">

                <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10">

                    <div className="text-center">

                        <h2 className="text-4xl font-bold">
                            Welcome Back 👋
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Login to continue using SwiftTopUp
                        </p>

                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="mt-10 space-y-5"
                    >

                        <div>

                            <label className="font-semibold">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />

                        </div>

                        <div>

                            <label className="font-semibold">
                                Password
                            </label>

                            <div className="relative mt-2">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border rounded-xl p-4 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-4 text-gray-500"
                                >

                                    {showPassword ? <FaEyeSlash /> : <FaEye />}

                                </button>

                            </div>

                        </div>

                        <div className="flex justify-between items-center">

                            <label className="flex items-center gap-2">

                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />

                                Remember Me

                            </label>

                            <Link
                                to="#"
                                className="text-blue-600 font-semibold"
                            >
                                Forgot Password?
                            </Link>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full rounded-xl py-4 text-white font-bold text-lg transition ${
                                loading
                                    ? "bg-gray-500"
                                    : "bg-blue-700 hover:bg-blue-800"
                            }`}
                        >

                            {loading ? "Signing In..." : "Login"}

                        </button>

                    </form>

                    <div className="mt-8 text-center">

                        <p>
                            Don't have an account?
                        </p>

                        <Link
                            to="/register"
                            className="text-blue-700 font-bold"
                        >
                            Create Account
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;