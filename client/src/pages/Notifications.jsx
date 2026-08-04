import Sidebar from "../components/layout/Sidebar";

function Notifications() {

    const notifications = [

        {
            title: "Wallet Funded",
            message: "₦5,000 has been added to your wallet.",
            time: "2 mins ago",
            icon: "💰"
        },

        {
            title: "Data Purchase",
            message: "MTN 2GB purchased successfully.",
            time: "10 mins ago",
            icon: "🌐"
        },

        {
            title: "Airtime Purchase",
            message: "₦500 Airtime delivered.",
            time: "Today",
            icon: "📱"
        },

        {
            title: "Electricity",
            message: "Token generated successfully.",
            time: "Yesterday",
            icon: "⚡"
        }

    ];

    return (

        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1 p-8">

                <h1 className="text-4xl font-bold mb-8">

                    Notifications

                </h1>

                <div className="bg-white rounded-2xl shadow-lg">

                    {

                        notifications.map((item,index)=>(

                            <div

                                key={index}

                                className="flex justify-between items-center border-b last:border-none p-6 hover:bg-gray-50"

                            >

                                <div className="flex gap-5">

                                    <div className="text-5xl">

                                        {item.icon}

                                    </div>

                                    <div>

                                        <h2 className="font-bold text-lg">

                                            {item.title}

                                        </h2>

                                        <p className="text-gray-500 mt-1">

                                            {item.message}

                                        </p>

                                    </div>

                                </div>

                                <div className="text-gray-400">

                                    {item.time}

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

        </div>

    );

}

export default Notifications;