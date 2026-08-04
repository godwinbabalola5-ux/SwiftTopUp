import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

function DashboardChart({ analytics }) {

    const data = [

        {
            name: "Airtime",
            total: analytics.airtime
        },

        {
            name: "Data",
            total: analytics.data
        },

        {
            name: "Electricity",
            total: analytics.electricity
        },

        {
            name: "Cable",
            total: analytics.cable
        }

    ];

    return (

        <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6">

                Service Usage

            </h2>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="name"/>

                    <YAxis/>

                    <Tooltip/>

                    <Bar
                        dataKey="total"
                        radius={[10,10,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default DashboardChart;