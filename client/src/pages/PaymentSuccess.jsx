import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const reference = searchParams.get("reference");

      if (!reference) {
        alert("Payment reference not found.");
        return navigate("/wallet");
      }

      await api.get(`/payment/verify?reference=${reference}`);

      alert("🎉 Wallet funded successfully!");

      navigate("/wallet");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Payment verification failed."
      );

      navigate("/wallet");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen text-2xl font-bold">
      Verifying your payment...
    </div>
  );
}

export default PaymentSuccess;