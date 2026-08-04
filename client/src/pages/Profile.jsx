import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";

import ProfileImageUpload from "../components/profile/ProfileImageUpload";
import EditProfileModal from "../components/profile/EditProfileModal";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";

function Profile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProfile(response.data.profile);

        } catch (err) {
            console.log(err);
        }

    };

    const logout = () => {

        localStorage.removeItem("token");

        toast.success("Logged out successfully");

        navigate("/login");

    };

    const contactSupport = () => {

        window.location.href =
            "mailto:support@swifttopup.com?subject=SwiftTopUp Support";

    };

    if (!profile) {

        return (

            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">

                Loading...

            </div>

        );

    }

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

            <Sidebar />

            <div className="flex-1 p-8 text-gray-900 dark:text-white transition-colors duration-300">

                {/* HEADER */}

                <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl text-white p-10 shadow-lg">

                    <div className="flex flex-col md:flex-row items-center gap-8">

                        <ProfileImageUpload

                            user={profile}

                            refreshUser={loadProfile}

                        />

                        <div>

                            <h1 className="text-4xl font-bold">

                                {profile.fullname}

                            </h1>

                            <p className="mt-2 text-blue-100">

                                {profile.email}

                            </p>

                            <p className="mt-2">

                                📞 {profile.phone}

                            </p>

                        </div>

                    </div>

                </div>

                {/* CONTENT */}

                <div className="grid lg:grid-cols-2 gap-8 mt-10">

                    {/* LEFT */}

                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-colors">

                        <h2 className="text-2xl font-bold mb-6">

                            Account Information

                        </h2>

                        <div className="space-y-5">

                            <div>

                                <p className="text-gray-500 dark:text-gray-400">

                                    Wallet Balance

                                </p>

                                <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400">

                                    ₦{Number(profile.wallet).toLocaleString()}

                                </h2>

                            </div>

                            <div>

                                <p className="text-gray-500 dark:text-gray-400">

                                    Email

                                </p>

                                <h3>{profile.email}</h3>

                            </div>

                            <div>

                                <p className="text-gray-500 dark:text-gray-400">

                                    Phone

                                </p>

                                <h3>{profile.phone}</h3>

                            </div>

                            <div>

                                <p className="text-gray-500 dark:text-gray-400">

                                    Member Since

                                </p>

                                <h3>

                                    {new Date(profile.created_at).toLocaleDateString()}

                                </h3>

                            </div>

                            <div>

                                <p className="text-gray-500 dark:text-gray-400">

                                    Last Login

                                </p>

                                <h3>

                                    {profile.last_login
                                        ? new Date(profile.last_login).toLocaleString()
                                        : "Never"}

                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-colors">

                        <h2 className="text-2xl font-bold mb-6">

                            Account Actions

                        </h2>

                        <div className="space-y-4">
<button
    onClick={() => setShowEdit(true)}
    className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300"
>
    Edit Profile
</button>
                            <button

                                onClick={() => setShowPassword(true)}

                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl"

                            >

                                Change Password

                            </button>

                            <button

                                onClick={contactSupport}

                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"

                            >

                                Contact Support

                            </button>

                            <button

                                onClick={logout}

                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"

                            >

                                Logout

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {showEdit && (

                <EditProfileModal

                    profile={profile}

                    refreshProfile={loadProfile}

                    onClose={() => setShowEdit(false)}

                />

            )}

            {showPassword && (

                <ChangePasswordModal

                    onClose={() => setShowPassword(false)}

                />

            )}

        </div>

    );

}

export default Profile;