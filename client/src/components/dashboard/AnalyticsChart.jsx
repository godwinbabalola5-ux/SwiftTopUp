import { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import { ThemeContext } from "../../context/ThemeContext";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

function AnalyticsChart() {

    const { darkMode } = useContext(ThemeContext);

    const [data, setData] = useState([]);

    useEffect(() => {
        loadChart();
    }, []);

    const loadChart = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/analytics", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const analytics = response.data.analytics;

            setData([
                { name: "Fund", value: analytics.fund },
                { name: "Airtime", value: analytics.airtime },
                { name: "Data", value: analytics.data },
                { name: "Electricity", value: analytics.electricity },
                { name: "Cable", value: analytics.cable }
            ]);

        } catch (err) {

            console.log(err);

        }

    };

    const COLORS = [
        "#2563EB",
        "#22C55E",
        "#9333EA",
        "#F59E0B",
        "#EF4444"
    ];

    return (

        <div
            className={`rounded-2xl shadow-lg p-6 mt-10 ${
                darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white"
            }`}
        >

            <h2 className="text-2xl font-bold mb-6">

                Service Usage

            </h2>

            <ResponsiveContainer width="100%" height={350}>

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        label
                    >

                        {data.map((entry, index) => (

                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />

                        ))}

                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}

export default AnalyticsChart;