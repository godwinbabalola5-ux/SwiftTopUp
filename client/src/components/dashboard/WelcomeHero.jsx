import { useEffect, useState } from "react";
import {
    FaCloudSun,
    FaServer,
    FaChartLine,
    FaCalendarAlt
} from "react-icons/fa";
import { useForexRates } from "../../hooks/useForexRates";

function WelcomeHero({ user }) {

    const [time, setTime] = useState(new Date());
    const { rates, error } = useForexRates();

    useEffect(() => {

        const interval = setInterval(() => {

            setTime(new Date());

        }, 1000);

        return () => clearInterval(interval);

    }, []);

    const hour = time.getHours();

    let greeting = "Good Evening";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";

    const dollarRateDisplay = error
        ? "Unavailable"
        : rates.USD
        ? `₦${Number(rates.USD).toLocaleString()}`
        : "Loading...";

    return (

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 text-white p-10 shadow-2xl mt-8">

            <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative z-10">

                <h1 className="text-5xl font-black">

                    {greeting} 👋

                </h1>

                <h2 className="text-3xl font-semibold mt-3">

                    {user?.fullname}

                </h2>

                <p className="mt-4 text-blue-100">

                    Manage your finances smarter with SwiftTopUp.

                </p>

                <div className="grid md:grid-cols-4 gap-6 mt-10">

                    <div className="bg-white/10 rounded-2xl p-5">

                        <FaCalendarAlt size={24} />

                        <p className="mt-3 text-sm">

                            {time.toLocaleDateString()}

                        </p>

                        <h3 className="font-bold">

                            {time.toLocaleTimeString()}

                        </h3>

                    </div>

                    <div className="bg-white/10 rounded-2xl p-5">

                        <FaCloudSun size={24} />

                        <p className="mt-3 text-sm">

                            Weather

                        </p>

                        <h3 className="font-bold">

                            27°C Lagos

                        </h3>

                    </div>

                    <div className="bg-white/10 rounded-2xl p-5">

                        <FaServer size={24} />

                        <p className="mt-3 text-sm">

                            API Status

                        </p>

                        <h3 className="font-bold text-green-300">

                            ● Online

                        </h3>

                    </div>

                    <div className="bg-white/10 rounded-2xl p-5">

                        <FaChartLine size={24} />

                        <p className="mt-3 text-sm">

                            Dollar Rate

                        </p>

                        <h3 className="font-bold">

                            {dollarRateDisplay}

                        </h3>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default WelcomeHero;
