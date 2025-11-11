import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

export default function Payment() {
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const { problem_ID, subscriptioType } = location.state || {};
  

  // To Get the API KEY from the backend
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axiosClient.get("/paymentIntegration/getAPI");
        const key = response.data.key;
        console.log("Razorpay Key:", key);
        setApiKey(key);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchPayment();
  }, []);

  useEffect(() => {
    console.log(problem_ID);
    console.log(subscriptioType);
  });

  // Function to trigger Razorpay popup
  const handlePayment = async () => {
    try {
      const { data: order } = await axiosClient.post(
        "/paymentIntegration/money",
        {
          subscriptionType: subscriptioType, // Sending the subscription type to backend
        }
      );

      const options = {
        key: apiKey,
        amount: order.amount,
        currency: "INR",
        name: "Algo Rank",
        description: "Test Transaction",
        order_id: order.id,
        callback_url: navigate(`/problem/${problem_ID}`),

        prefill: {
          name: "Ashwani Singh",
          email: "ashwani@.com",
          contact: "9999999999",
        },
        theme: {
          color: "#99ccff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 space-y-4">
      <div className="text-xl font-semibold">
        This is the Payment Integration Page
      </div>
      <button
        onClick={handlePayment}
        className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-all"
      >
        Pay ₹2
      </button>
    </div>
  );
}
