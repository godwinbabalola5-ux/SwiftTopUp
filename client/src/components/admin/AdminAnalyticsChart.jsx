import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from "recharts";

import api from "../../services/api";

function AdminAnalyticsChart() {

    const [data, setData] = useState([]);

    useEffect(() => {

        loadAnalytics();

    }, []);

    const loadAnalytics = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/analytics",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setData(response.data.analytics);

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <h2 className="text-2xl font-bold mb-6">
                Last 7 Days Analytics
            </h2>

            <ResponsiveContainer width="100%" height={400}>

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="funding"
                        stroke="#16a34a"
                    />

                    <Line
                        type="monotone"
                        dataKey="airtime"
                        stroke="#2563eb"
                    />

                    <Line
                        type="monotone"
                        dataKey="data"
                        stroke="#f59e0b"
                    />

                    <Line
                        type="monotone"
                        dataKey="electricity"
                        stroke="#dc2626"
                    />

                    <Line
                        type="monotone"
                        dataKey="cable"
                        stroke="#7c3aed"
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}

export default AdminAnalyticsChart;