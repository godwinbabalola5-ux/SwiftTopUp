import { Link } from "react-router-dom";

function Home() {

    const services = [

        {
            icon: "📱",
            title: "Airtime"
        },

        {
            icon: "🌐",
            title: "Data"
        },

        {
            icon: "⚡",
            title: "Electricity"
        },

        {
            icon: "📺",
            title: "Cable TV"
        },

        {
            icon: "💰",
            title: "Wallet Funding"
        }

    ];

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">

            <nav className="flex justify-between items-center px-10 py-6">

                <h1 className="text-3xl font-bold">

                    SwiftTopUp

                </h1>

                <div className="space-x-4">

                    <Link
                        to="/login"
                        className="px-5 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="bg-white text-blue-700 px-5 py-2 rounded-lg font-bold hover:scale-105 transition"
                    >
                        Register
                    </Link>

                </div>

            </nav>

            <section className="text-center py-24 px-6">

                <h2 className="text-6xl font-extrabold">

                    Nigeria's Smart VTU Platform

                </h2>

                <p className="text-xl mt-6 max-w-3xl mx-auto text-blue-100">

                    Buy airtime, data bundles, pay electricity bills,
                    subscribe to cable TV, and fund your wallet securely—
                    all in one place.

                </p>

                <Link

                    to="/register"

                    className="inline-block mt-10 bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition"

                >

                    Get Started

                </Link>

            </section>

            <section className="max-w-6xl mx-auto px-8 pb-20">

                <h2 className="text-3xl font-bold text-center mb-12">

                    Our Services

                </h2>

                <div className="grid md:grid-cols-5 gap-6">

                    {

                        services.map((item) => (

                            <div

                                key={item.title}

                                className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center"

                            >

                                <div className="text-5xl">

                                    {item.icon}

                                </div>

                                <h3 className="mt-5 font-bold">

                                    {item.title}

                                </h3>

                            </div>

                        ))

                    }

                </div>

            </section>

            <section className="bg-white text-gray-800 py-20">

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-8">

                    <div>

                        <h3 className="text-2xl font-bold">

                            ⚡ Instant Delivery

                        </h3>

                        <p className="mt-3">

                            Transactions are processed within seconds.

                        </p>

                    </div>

                    <div>

                        <h3 className="text-2xl font-bold">

                            🔒 Secure Payments

                        </h3>

                        <p className="mt-3">

                            Your wallet and payments are protected with secure authentication.

                        </p>

                    </div>

                    <div>

                        <h3 className="text-2xl font-bold">

                            📞 Dedicated Support

                        </h3>

                        <p className="mt-3">

                            Our support team is available to help you whenever you need assistance.

                        </p>

                    </div>

                </div>

            </section>

            <footer className="text-center py-8 text-blue-100">

                © 2026 SwiftTopUp. All Rights Reserved.

            </footer>

        </div>

    );

}

export default Home;