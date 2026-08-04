function LiveTicker() {

    return (

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-xl mb-8">

            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-blue-700 to-transparent z-10"></div>

            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-indigo-700 to-transparent z-10"></div>

            <div className="animate-marquee whitespace-nowrap py-4 text-lg font-semibold">

                💵 USD/NGN: ₦1,635
                &nbsp;&nbsp;&nbsp;&nbsp;

                💶 EUR/NGN: ₦1,920
                &nbsp;&nbsp;&nbsp;&nbsp;

                💷 GBP/NGN: ₦2,180
                &nbsp;&nbsp;&nbsp;&nbsp;

                📢 SwiftTopUp now supports Electricity, Cable TV, Airtime & Data.
                &nbsp;&nbsp;&nbsp;&nbsp;

                🎉 Invite friends and earn cashback soon!
                &nbsp;&nbsp;&nbsp;&nbsp;

                🔒 All transactions are protected with bank-grade encryption.
                &nbsp;&nbsp;&nbsp;&nbsp;

                ⚡ Transactions complete within seconds.

            </div>

        </div>

    );

}

export default LiveTicker;