import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function StatsCard({
    title,
    value,
    icon,
    color
}) {

    const { darkMode } = useContext(ThemeContext);

    return (

        <div
            className={`rounded-2xl shadow-lg p-6 transition hover:shadow-xl ${
                darkMode
                    ? "bg-gray-800"
                    : "bg-white"
            }`}
        >

            <div className="flex justify-between items-center">

                <div>

                    <p
                        className={
                            darkMode
                                ? "text-gray-300"
                                : "text-gray-500"
                        }
                    >
                        {title}
                    </p>

                    <h2 className={`text-3xl font-bold mt-2 ${color}`}>
                        {value}
                    </h2>

                </div>

                <div className="text-5xl">
                    {icon}
                </div>

            </div>

        </div>

    );

}

export default StatsCard;