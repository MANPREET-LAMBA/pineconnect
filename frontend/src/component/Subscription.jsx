import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscription = async () => {
      const result = await axios.get(
        "http://localhost:3000/payment/subscription",
      );
      setPlans(result.data);
      console.log(result.data);
    };
    fetchSubscription();
  }, []);

  const handlePayment = async (planId) => {
    const hasToken = document.cookie.includes("token");
    console.log(document.cookie.includes("token"));
    console.log(hasToken);

    // 🔥 If no cookie → go to login immediately
    if (!hasToken) {
      navigate("/login");
      alert("login first");
      return;
    }

    try {
      const auth = await axios.get("http://localhost:3000/api/checkauth", {
        withCredentials: true,
      });

      console.log(auth);

      const { data } = await axios.post(
        "http://localhost:3000/payment/create-order",
        { planId },
        { withCredentials: true },
      );
      console.log("payment process ")
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        method: {
          card: true,
          netbanking: true,
          wallet: true,
          upi: true, 

        },
        checkout_config_id: "config_SLYcPTj7E80P1U",
        handler: async function (response) {
          console.log("calling verfication")
          await axios.post(
            "http://localhost:3000/payment/verify-payment",
            {
              ...response,
              planId,
              paymentEntryId: data.paymentEntryId,
            },
            { withCredentials: true },
          );

          alert("Payment Successful");
        },
      };

      console.log("Razorpay SDK", window.Razorpay);
      console.log("create-order response", data);
      const rzp = new window.Razorpay(options);
      console.log("rzp created", rzp);
      rzp.open();
    } catch (error) {
      alert("payment error");
    }
  };

  return (
    <section
      id="pricing"
      className="relative min-h-screen bg-[#0B0618] text-white py-28 px-6 overflow-hidden"
    >
      {/* 🔥 Animated Background Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse top-[-200px] left-[-150px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[150px] animate-pulse bottom-[-150px] right-[-150px]"></div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px]"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold">
            Flexible{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
              Pricing Plans
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg">
            Powerful infrastructure to automate and scale your trading
            strategies with confidence.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-10 mt-20 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group rounded-2xl p-10 border backdrop-blur-xl transition-all duration-500 hover:-translate-y-3
              ${plan.highlight
                  ? "border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.3)] bg-white/10"
                  : "border-white/10 bg-white/5 hover:border-purple-500/40"
                }`}
            >
              {plan.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-purple-500 text-black text-xs font-semibold px-5 py-1 rounded-full shadow-lg">
                  MOST POPULAR
                </span>
              )}

              <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>

              <p className="text-4xl font-bold mt-6">{plan.price}</p>

              <ul className="mt-8 space-y-4 text-gray-300">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-emerald-400">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className="mt-10 w-full py-3 rounded-lg font-semibold  bg-white/10 text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-emerald-500 hover:text-white transition-all duration-500"
                onClick={() => {
                  handlePayment(plan._id);
                }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Subscription;
