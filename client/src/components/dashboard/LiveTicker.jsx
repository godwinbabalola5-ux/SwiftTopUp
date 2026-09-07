import { useState, useEffect } from "react";

function LiveTicker() {
  const [rates, setRates] = useState({
    USD: null,
    EUR: null,
    GBP: null,
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      try {
        // Free, no API key required
        const res = await fetch("https://open.er-api.com/v6/latest/NGN");
        const data = await res.json();

        if (data?.rates) {
          // API gives NGN -> USD (e.g. 0.00061), so we invert to get USD -> NGN
          setRates({
            USD: (1 / data.rates.USD).toFixed(0),
            EUR: (1 / data.rates.EUR).toFixed(0),
            GBP: (1 / data.rates.GBP).toFixed(0),
          });
          setError(false);
        }
      } catch (err) {
        console.error("Failed to fetch forex rates:", err);
        setError(true);
      }
    }

    fetchRates(); // fetch immediately on mount

    // refresh every 30 minutes — no need for anything faster
    const interval = setInterval(fetchRates, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatRate = (value) =>
    value ? `₦${Number(value).toLocaleString()}` : "Loading...";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-xl mb-8">
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-blue-700 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-indigo-700 to-transparent z-10"></div>

      <div className="animate-marquee whitespace-nowrap py-4 text-lg font-semibold">
        💵 USD/NGN: {error ? "Unavailable" : formatRate(rates.USD)}
        &nbsp;&nbsp;&nbsp;&nbsp;
        💶 EUR/NGN: {error ? "Unavailable" : formatRate(rates.EUR)}
        &nbsp;&nbsp;&nbsp;&nbsp;
        💷 GBP/NGN: {error ? "Unavailable" : formatRate(rates.GBP)}
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