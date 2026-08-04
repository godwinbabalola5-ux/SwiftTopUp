import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext } from "react";
import NotificationBell from "../notifications/NotificationBell";
import { ThemeContext } from "../../context/ThemeContext";

function DashboardHeader({ user }) {

    const { darkMode } = useContext(ThemeContext);

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 17) {
        greeting = "Good Afternoon";
    }

    return (

        <div className="flex justify-between items-center mb-10">

            <div>

                <h1
                    className={`text-4xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                    {greeting},
                </h1>

                <p
                    className={`text-2xl mt-2 ${
                        darkMode ? "text-blue-400" : "text-blue-700"
                    }`}
                >
                    {user?.fullname}
                </p>

            </div>

            <div className="flex items-center gap-6">

                <NotificationBell />

                <Link
                    to="/profile"
                    className={`text-4xl transition ${
                        darkMode
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-700 hover:text-blue-900"
                    }`}
                >
                    <FaUserCircle />
                </Link>

            </div>

        </div>

    );

}

export default DashboardHeader;