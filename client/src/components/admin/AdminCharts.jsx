import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell
} from "recharts";

const COLORS = [
    "#2563eb",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6"
];

function AdminCharts({ analytics }) {

    const pieData = analytics.reduce((arr, item) => {

        arr[0].value += Number(item.airtime || 0);
        arr[1].value += Number(item.data || 0);
        arr[2].value += Number(item.electricity || 0);
        arr[3].value += Number(item.cable || 0);

        return arr;

    }, [

        { name: "Airtime", value: 0 },

        { name: "Data", value: 0 },

        { name: "Electricity", value: 0 },

        { name: "Cable", value: 0 }

    ]);

    return (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

            {/* Revenue Line Chart */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-2xl font-bold mb-6">
                    Daily Funding
                </h2>

                <ResponsiveContainer width="100%" height={320}>

                    <LineChart data={analytics}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="day" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="funding"
                            stroke="#2563eb"
                            strokeWidth={4}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

            {/* Services Pie Chart */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-2xl font-bold mb-6">
                    Service Distribution
                </h2>

                <ResponsiveContainer width="100%" height={320}>

                    <PieChart>

                        <Pie
                            data={pieData}
                            dataKey="value"
                            outerRadius={110}
                            label
                        >

                            {

                                pieData.map((entry, index) => (

                                    <Cell
                                        key={index}
                                        fill={COLORS[index]}
                                    />

                                ))

                            }

                        </Pie>

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default AdminCharts;