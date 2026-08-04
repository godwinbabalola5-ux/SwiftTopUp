import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ChangePasswordModal({ onClose }) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {

        if (!currentPassword || !newPassword || !confirmPassword) {

            toast.error("All fields are required.");

            return;

        }

        if (newPassword !== confirmPassword) {

            toast.error("Passwords do not match.");

            return;

        }

        if (newPassword.length < 6) {

            toast.error("Password must be at least 6 characters.");

            return;

        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.put(
                "/profile/change-password",
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(response.data.message);

            onClose();

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Unable to change password."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white dark:bg-slate-900 rounded-2xl w-[430px] p-8 shadow-2xl">

                <h2 className="text-3xl font-bold mb-6 dark:text-white">

                    Change Password

                </h2>

                {/* Current Password */}

                <div className="mb-5 relative">

                    <input
                        type={showCurrent ? "text" : "password"}
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e)=>setCurrentPassword(e.target.value)}
                        className="w-full border dark:border-slate-700 rounded-xl p-4 dark:bg-slate-800 dark:text-white"
                    />

                    <button
                        type="button"
                        onClick={()=>setShowCurrent(!showCurrent)}
                        className="absolute right-4 top-5"
                    >
                        {showCurrent ? <FaEyeSlash /> : <FaEye />}
                    </button>

                </div>

                {/* New Password */}

                <div className="mb-5 relative">

                    <input
                        type={showNew ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e)=>setNewPassword(e.target.value)}
                        className="w-full border dark:border-slate-700 rounded-xl p-4 dark:bg-slate-800 dark:text-white"
                    />

                    <button
                        type="button"
                        onClick={()=>setShowNew(!showNew)}
                        className="absolute right-4 top-5"
                    >
                        {showNew ? <FaEyeSlash /> : <FaEye />}
                    </button>

                </div>

                {/* Confirm Password */}

                <div className="mb-6 relative">

                    <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        className="w-full border dark:border-slate-700 rounded-xl p-4 dark:bg-slate-800 dark:text-white"
                    />

                    <button
                        type="button"
                        onClick={()=>setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-5"
                    >
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>

                </div>

                <div className="flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-gray-400 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading ? "Saving..." : "Update Password"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ChangePasswordModal;