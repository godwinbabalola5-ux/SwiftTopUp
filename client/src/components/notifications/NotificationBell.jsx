import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import socket from "../../services/socket";
import toast from "react-hot-toast";
function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef();

    const loadNotifications = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNotifications(response.data.notifications);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

    loadNotifications();

   socket.on("newNotification", (data) => {

    loadNotifications();

    toast.success(
        `${data.title}\n${data.message}`
    );

});

}, []);

    const unread = notifications.filter(
        item => !item.is_read
    ).length;

    const markAsRead = async (id) => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/notifications/${id}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            loadNotifications();

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        const closeDropdown = (e) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {

                setOpen(false);

            }

        };

        document.addEventListener("mousedown", closeDropdown);

        return () =>
            document.removeEventListener("mousedown", closeDropdown);

    }, []);

    return (

        <div
            className="relative"
            ref={dropdownRef}
        >

            <button
                onClick={() => setOpen(!open)}
                className="relative"
            >

                <FaBell className="text-2xl text-gray-700 hover:text-blue-600 transition" />

                {unread > 0 && (

                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">

                        {unread}

                    </span>

                )}

            </button>

            {open && (

                <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50">

                    <div className="flex justify-between items-center p-4 border-b">

                        <h2 className="font-bold text-lg">

                            Notifications

                        </h2>

                        <span className="text-sm text-gray-500">

                            {unread} unread

                        </span>

                    </div>

                    <div className="max-h-96 overflow-y-auto">

                        {notifications.length === 0 ? (

                            <div className="p-8 text-center text-gray-500">

                                🎉 You're all caught up!

                            </div>

                        ) : (

                            notifications
                                .slice(0, 5)
                                .map(item => (

                                    <div
                                        key={item.id}
                                        onClick={() => markAsRead(item.id)}
                                        className={`cursor-pointer p-4 border-b hover:bg-gray-50 transition ${
                                            !item.is_read
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                    >

                                        <div className="flex justify-between">

                                            <h3 className="font-semibold">

                                                {item.title}

                                            </h3>

                                            {!item.is_read && (

                                                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2"></span>

                                            )}

                                        </div>

                                        <p className="text-sm text-gray-600 mt-1">

                                            {item.message}

                                        </p>

                                        <p className="text-xs text-gray-400 mt-2">

                                            {new Date(
                                                item.created_at
                                            ).toLocaleString()}

                                        </p>

                                    </div>

                                ))

                        )}

                    </div>

                    <div className="border-t p-3 text-center bg-gray-50">

                        <Link
                            to="/notifications"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            View All Notifications
                        </Link>

                    </div>

                </div>

            )}

        </div>

    );

}

export default NotificationBell;