import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";
import { toast } from "react-toastify";
function AdminWallet() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

const [amount, setAmount] = useState("");

const [reason, setReason] = useState("");

const [type, setType] = useState("credit");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/wallet/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(response.data.users);

        } catch (err) {

            console.log(err);

        }

    };
    const updateWallet = async () => {

    try {

        const token = localStorage.getItem("token");

        await api.put(
            `/admin/wallet/${selectedUser.id}`,
            {
                amount: Number(amount),
                type,
                reason
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        toast.success("Wallet updated successfully.");

        setSelectedUser(null);

        loadUsers();

    } catch (err) {

        console.log(err);

        toast.error(
            err.response?.data?.message || "Wallet update failed."
        );

    }

};

    const filteredUsers = users.filter(user =>
        user.fullname.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">

            <Sidebar />

            <div className="flex-1 p-8">

                <div className="mb-8">

    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Wallet Management
    </h1>

    <p className="text-gray-500 dark:text-gray-400 mt-2">
        Monitor and manage every user's wallet.
    </p>

</div>

<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 mb-8 transition-colors">

    <div className="relative">

        <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl p-4"
        />

    </div>

</div>

<div className="grid md:grid-cols-4 gap-6 mb-8">

    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

        <p className="text-gray-500 dark:text-gray-400">
            Total Users
        </p>

        <h2 className="text-3xl font-bold text-blue-600 mt-3">
            {filteredUsers.length}
        </h2>

    </div>

    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

        <p className="text-gray-500 dark:text-gray-400">
            Active Users
        </p>

        <h2 className="text-3xl font-bold text-green-600 mt-3">

            {
                filteredUsers.filter(
                    user=>user.status==="active"
                ).length
            }

        </h2>

    </div>

    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

        <p className="text-gray-500 dark:text-gray-400">
            Suspended
        </p>

        <h2 className="text-3xl font-bold text-red-600 mt-3">

            {
                filteredUsers.filter(
                    user=>user.status!=="active"
                ).length
            }

        </h2>

    </div>

    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">

        <p className="text-gray-500 dark:text-gray-400">
            Total Wallet Balance
        </p>

        <h2 className="text-3xl font-bold text-purple-600 mt-3">

            ₦{
                filteredUsers
                    .reduce(
                        (sum,user)=>
                            sum + Number(user.wallet),
                        0
                    )
                    .toLocaleString()
            }

        </h2>

    </div>

</div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-colors">

                    <table className="w-full text-gray-800 dark:text-white">

                        <thead className="bg-blue-600 text-white">

                            <tr>

                                <th className="p-4 text-left">
                                    Name
                                </th>

                                <th>Email</th>

                                <th>Wallet</th>

                                <th>Status</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                filteredUsers.map(user => (

                                   <tr
    key={user.id}
    className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
>

                                        <td className="p-4">
                                            {user.fullname}
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            ₦{Number(user.wallet).toLocaleString()}
                                        </td>

                                        <td>
                                            {user.status}
                                        </td>

                                        <td>

                                            <button
    onClick={() => {
        setSelectedUser(user);
        setAmount("");
        setReason("");
        setType("credit");
    }}
    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition text-white px-5 py-2 rounded-xl shadow-md"
>
    Manage Wallet
</button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>
            {
    selectedUser && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 w-[480px] shadow-2xl transition-colors">

                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">

                    Wallet Management

                </h2>

                <div className="space-y-4">

                    <div>

                        <label className="font-semibold">

                            Customer

                        </label>

                       <p className="mt-1 text-lg text-gray-700 dark:text-gray-300">

                            {selectedUser.fullname}

                        </p>

                    </div>

                    <div>

                        <label className="font-semibold">

                            Current Balance

                        </label>

                        <p className="text-3xl text-green-600 font-bold">

                            ₦{Number(selectedUser.wallet).toLocaleString()}

                        </p>

                    </div>

                    <input
    type="number"
    placeholder="Enter amount"
    value={amount}
    onChange={(e)=>setAmount(e.target.value)}
    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl p-4"
/>

                    <textarea
    placeholder="Reason for this transaction..."
    value={reason}
    onChange={(e)=>setReason(e.target.value)}
    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl p-4"
/>
                   <select
    value={type}
    onChange={(e)=>setType(e.target.value)}
    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl p-4"
>
    <option value="credit">Credit Wallet</option>
    <option value="debit">Debit Wallet</option>
</select>

                    <div className="flex justify-end gap-4">

                        <button
                            onClick={() => setSelectedUser(null)}
                            className="bg-gray-400 text-white px-5 py-2 rounded-lg"
                        >

                            Cancel

                        </button>

                        <button
    onClick={updateWallet}
    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 transition text-white px-6 py-3 rounded-xl shadow-lg"
>
    Save Changes
</button>

                    </div>

                </div>

            </div>

        </div>

    )
}

        </div>

    );

}

export default AdminWallet;