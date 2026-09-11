import {
    FaHome,
    FaWallet,
    FaMobileAlt,
    FaDatabase,
    FaBolt,
    FaTv,
    FaHistory,
    FaUser,
    FaHeadset,
    FaCog,
    FaSignOutAlt,
    FaUserShield,
    FaMoneyCheckAlt,
    FaBars,
    FaTimes
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

function Sidebar() {

    const navigate = useNavigate();

    const { user, logout } = useContext(AuthContext);
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    // Controls whether the sidebar is slid into view on small screens.
    // On desktop (md breakpoint and up) this is ignored entirely —
    // the sidebar just stays visible like it always has.
    const [isOpen, setIsOpen] = useState(false);

    const menus = [

        {
            name: "Dashboard",
            icon: <FaHome />,
            path: "/dashboard"
        },

        {
            name: "Wallet",
            icon: <FaWallet />,
            path: "/wallet"
        },

        {
            name: "Airtime",
            icon: <FaMobileAlt />,
            path: "/airtime"
        },

        {
            name: "Data",
            icon: <FaDatabase />,
            path: "/data"
        },

        {
            name: "Electricity",
            icon: <FaBolt />,
            path: "/electricity"
        },

        {
            name: "Cable TV",
            icon: <FaTv />,
            path: "/cable"
        },

        {
            name: "Transactions",
            icon: <FaHistory />,
            path: "/transactions"
        },

        {
            name: "Profile",
            icon: <FaUser />,
            path: "/profile"
        },

        ...(user?.role === "admin"
            ? [

                {
                    name: "Admin Dashboard",
                    icon: <FaUserShield />,
                    path: "/admin"
                },

                {
                    name: "Manage Users",
                    icon: <FaUser />,
                    path: "/admin/users"
                },

                {
                    name: "Admin Transactions",
                    icon: <FaHistory />,
                    path: "/admin/transactions"
                },

                {
                    name: "Wallet Management",
                    icon: <FaWallet />,
                    path: "/admin/wallet"
                },

                {
                    name: "Wallet History",
                    icon: <FaHistory />,
                    path: "/admin/wallet/history"
                },

                {
                    name: "Refund Management",
                    icon: <FaMoneyCheckAlt />,
                    path: "/admin/refunds"
                },

                {
                    name: "Admin Settings",
                    icon: <FaCog />,
                    path: "/admin/settings"
                },
                {
    name: "Business Wallet",
    icon: <FaWallet />,
    path: "/admin/business-wallet"
},
{
    name: "Business Withdrawals",
    icon: <FaMoneyCheckAlt />,
    path: "/admin/business-withdrawals"
},


            ]
            : [])

    ];

    const handleLogout = () => {

        logout();
        navigate("/login");

    };

    // Closes the mobile drawer whenever a nav link is actually clicked —
    // otherwise the menu would stay open and cover the page after navigating.
    const handleNavClick = () => {
        setIsOpen(false);
    };

    return (

        <>

            {/* Hamburger button — only shows below the md breakpoint.
                Fixed so it's always reachable regardless of scroll position. */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 bg-blue-800 text-white p-3 rounded-xl shadow-lg"
                aria-label="Open menu"
            >
                <FaBars />
            </button>

            {/* Backdrop — only rendered on mobile while the menu is open.
                Tapping it closes the menu, same as tapping outside a dropdown. */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                />
            )}

            <div
                className={`
                    w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white
                    min-h-screen flex flex-col shadow-2xl
                    fixed inset-y-0 left-0 z-50 overflow-y-auto
                    transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:static md:translate-x-0
                `}
            >

                {/* Close button — only visible on mobile, sits inside the drawer */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden self-end m-4 text-white text-xl"
                    aria-label="Close menu"
                >
                    <FaTimes />
                </button>

                {/* Logo */}

                <div className="text-center py-8 border-b border-blue-700">

                    <h1 className="text-3xl font-extrabold">
                        SwiftTopUp
                    </h1>

                    <p className="text-blue-200 text-sm mt-2">
                        Fast • Secure • Reliable
                    </p>

                </div>

                {/* User */}

                <div className="px-6 py-6 border-b border-blue-700">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-full bg-white text-blue-700 flex items-center justify-center text-2xl font-bold">

                            {user?.fullname?.charAt(0)?.toUpperCase() || "U"}

                        </div>

                        <div>

                            <h2 className="font-bold">
                                {user?.fullname}
                            </h2>

                            <p className="text-green-300 text-sm">

                                ● {user?.role === "admin"
                                    ? "Administrator"
                                    : "Online"}

                            </p>

                        </div>

                    </div>

                </div>

                {/* Navigation */}

                <div className="flex-1 px-4 py-6">

                    <div className="space-y-2">

                        {menus.map((menu) => (

                            <NavLink
                                key={menu.path}
                                to={menu.path}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                                        isActive
                                            ? "bg-white text-blue-800 shadow-lg"
                                            : "hover:bg-blue-700"
                                    }`
                                }
                            >

                                <span className="text-xl">
                                    {menu.icon}
                                </span>

                                {menu.name}

                            </NavLink>

                        ))}

                    </div>

                    {/* Bottom */}

                    <div className="mt-10 border-t border-blue-700 pt-6 space-y-2">

                        <NavLink
                            to="/support"
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                                `flex items-center gap-4 p-4 rounded-xl transition ${
                                    isActive
                                        ? "bg-white text-blue-800 shadow-lg"
                                        : "hover:bg-blue-700"
                                }`
                            }
                        >
                            <FaHeadset />
                            Support
                        </NavLink>

                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-blue-700 transition"
                        >
                            {darkMode ? <FaSun /> : <FaMoon />}
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-red-600 hover:bg-red-700 transition"
                        >

                            <FaSignOutAlt />
                            Logout

                        </button>

                    </div>

                </div>

                {/* Footer */}

                <div className="border-t border-blue-700 p-5 text-center text-xs text-blue-200">

                    <p>
                        SwiftTopUp v1.0
                    </p>

                    <p className="mt-2">
                        © 2026 All Rights Reserved
                    </p>

                </div>

            </div>

        </>

    );

}

export default Sidebar;
