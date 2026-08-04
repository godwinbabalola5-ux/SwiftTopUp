import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import { toast } from "react-toastify";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(response.data.users);

        } catch (err) {

            console.log(err);

            toast.error("Unable to load users.");

        }

    };

    const changeStatus = async (id, status) => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/admin/users/${id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("User status updated.");

            loadUsers();

        } catch (err) {

            console.log(err);

            toast.error("Unable to update user.");

        }

    };

    const deleteUser = async (id) => {

        if (!window.confirm("Delete this user?")) return;

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/admin/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("User deleted.");

            loadUsers();

        } catch (err) {

            console.log(err);

            toast.error("Unable to delete user.");

        }

    };

    const filteredUsers = users.filter(user =>
        user.fullname.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">

            <Sidebar />

            <div className="flex-1 p-8 text-gray-900 dark:text-white transition-colors duration-300">

                <h1 className="text-4xl font-bold mb-8">

                    User Management

                </h1>

                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-6 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">

                    <table className="w-full">

                        <thead className="bg-blue-600 text-white">

                            <tr>

                                <th className="p-4 text-left">Name</th>

                                <th>Email</th>

                                <th>Wallet</th>

                                <th>Role</th>

                                <th>Status</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                filteredUsers.map((user) => (

                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300"
                                    >

                                        <td className="p-4 font-semibold">

                                            {user.fullname}

                                        </td>

                                        <td>

                                            {user.email}

                                        </td>

                                        <td>

                                            ₦{Number(user.wallet).toLocaleString()}

                                        </td>

                                        <td>

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    user.role === "admin"
                                                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                                                        : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                                                }`}
                                            >

                                                {user.role}

                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    user.status === "active"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                }`}
                                            >

                                                {user.status}

                                            </span>

                                        </td>

                                        <td className="space-x-2">

                                            <button

                                                disabled={user.role === "admin"}

                                                onClick={() =>
                                                    changeStatus(
                                                        user.id,
                                                        user.status === "active"
                                                            ? "suspended"
                                                            : "active"
                                                    )
                                                }

                                                className={`px-3 py-2 rounded-lg text-white transition ${
                                                    user.role === "admin"
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-yellow-500 hover:bg-yellow-600"
                                                }`}
                                            >

                                                {user.status === "active"
                                                    ? "Suspend"
                                                    : "Activate"}

                                            </button>

                                            <button

                                                disabled={user.role === "admin"}

                                                onClick={() => deleteUser(user.id)}

                                                className={`px-3 py-2 rounded-lg text-white transition ${
                                                    user.role === "admin"
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-red-600 hover:bg-red-700"
                                                }`}

                                            >

                                                Delete

                                            </button>

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

export default AdminUsers;