import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { FaUser, FaPhone } from "react-icons/fa";

function EditProfileModal({
    profile,
    refreshProfile,
    onClose
}) {

    const [fullname, setFullname] = useState(profile.fullname);
    const [phone, setPhone] = useState(profile.phone);
    const [loading, setLoading] = useState(false);

    const updateProfile = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            await api.put(
                "/profile",
                {
                    fullname,
                    phone
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Profile updated successfully.");

            await refreshProfile();

            onClose();

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Update failed."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8">

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">

                    Edit Profile

                </h2>

                {/* Full Name */}

                <div className="mb-5">

                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">

                        Full Name

                    </label>

                    <div className="relative">

                        <FaUser className="absolute left-4 top-4 text-gray-400" />

                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                    </div>

                </div>

                {/* Phone */}

                <div className="mb-8">

                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">

                        Phone Number

                    </label>

                    <div className="relative">

                        <FaPhone className="absolute left-4 top-4 text-gray-400" />

                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                    </div>

                </div>

                {/* Buttons */}

                <div className="flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-slate-600 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={updateProfile}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default EditProfileModal;