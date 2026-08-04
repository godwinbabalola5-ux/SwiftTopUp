import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function WelcomeSlider() {

    const slides = [

        {
            title: "🚀 Welcome Back",
            subtitle: "Buy Airtime, Data, Electricity & Cable within seconds.",
            button: "Fund Wallet",
            link: "/fund-wallet",
            bg: "from-blue-700 via-blue-600 to-indigo-700"
        },

        {
            title: "🎁 Cashback Coming Soon",
            subtitle: "Earn rewards every time you transact on SwiftTopUp.",
            button: "Coming Soon",
            link: "#",
            bg: "from-purple-700 via-pink-600 to-fuchsia-700"
        },

        {
            title: "⚡ Fast • Secure • Reliable",
            subtitle: "99.9% transaction success with lightning-fast delivery.",
            button: "Start Buying",
            link: "/airtime",
            bg: "from-green-600 via-emerald-500 to-teal-600"
        },

        {
            title: "💬 Need Help?",
            subtitle: "Our support team is available 24/7 on WhatsApp.",
            button: "Contact Support",
            link: "/support",
            bg: "from-orange-500 via-red-500 to-pink-600"
        }

    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrent((prev) =>

                prev === slides.length - 1
                    ? 0
                    : prev + 1

            );

        }, 5000);

        return () => clearInterval(interval);

    }, []);

    return (

        <div
            className={`relative overflow-hidden rounded-3xl shadow-2xl mb-8 bg-gradient-to-r ${slides[current].bg} text-white p-10 transition-all duration-700`}
        >

            <div className="max-w-2xl">

                <h1 className="text-4xl font-bold">

                    {slides[current].title}

                </h1>

                <p className="mt-4 text-lg text-white/90">

                    {slides[current].subtitle}

                </p>

                <Link
                    to={slides[current].link}
                    className="inline-block mt-8 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:scale-105 transition"
                >

                    {slides[current].button}

                </Link>

            </div>

            <div className="absolute bottom-5 left-10 flex gap-3">

                {slides.map((_, index) => (

                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            current === index
                                ? "bg-white w-10"
                                : "bg-white/40"
                        }`}
                    />

                ))}

            </div>

        </div>

    );

}

export default WelcomeSlider;