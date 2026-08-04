import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

function ProfileImageUpload({ user, refreshUser }) {

    const [loading, setLoading] = useState(false);

    const uploadImage = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();

        formData.append("profile", file);

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            await api.post(

                "/profile/upload",

                formData,

                {

                    headers: {

                        Authorization: `Bearer ${token}`,

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            toast.success("Profile picture updated.");

            if (refreshUser) {

                await refreshUser();

            }

        } catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Upload failed."

            );

        } finally {

            setLoading(false);

        }

    };

console.log(user);
console.log(user.profile_picture);
    const imageUrl = user?.profile_picture
        ? `http://localhost:5174${user.profile_picture}`
        : "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff&size=200";

    return (

        <div className="flex flex-col items-center">

            <label className="cursor-pointer">

                <img

                    src={imageUrl}

                    alt="Profile"

                    className="w-36 h-36 rounded-full object-cover border-4 border-blue-600 shadow-lg hover:opacity-80 transition"

                />

                <input

                    type="file"

                    accept="image/*"

                    className="hidden"

                    onChange={uploadImage}

                />

            </label>

            <p className="mt-4 font-semibold">

                {loading ? "Uploading..." : "Click image to change"}

            </p>

        </div>

    );

}

export default ProfileImageUpload;