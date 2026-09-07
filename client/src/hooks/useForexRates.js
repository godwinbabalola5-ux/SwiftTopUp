import { useState, useEffect } from "react";

// Shared hook so every component showing forex rates
// pulls from the same source and formula — no drifting values.
export function useForexRates() {
  const [rates, setRates] = useState({
    USD: null,
    EUR: null,
    GBP: null,
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/NGN");
        const data = await res.json();

        if (data?.rates) {
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

    fetchRates();
    const interval = setInterval(fetchRates, 30 * 60 * 1000); // every 30 min

    return () => clearInterval(interval);
  }, []);

  return { rates, error };
}
