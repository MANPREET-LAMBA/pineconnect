import React from "react";
import { useEffect } from "react";
import axios from "axios"
import { useState } from "react";



const Subscription = () => {
  const [plans,datahandler] = useState([]);

 useEffect(() => {
  const fetchSubscription = async () => {
    const result = await axios.get("http://localhost:3000/subscription");
    console.log(result.data);
    
     datahandler(result.data)
   
  };

  fetchSubscription();
}, []);

 console.log(plans);

  return (
    <div className="min-h-screen text-purple-400 text-white py-24 px-6">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-400">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-gray-400">
          Powerful tools to automate and scale your trading strategies
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl p-8 border 
            ${plan.highlight
                ? "border-purple-500 shadow-[0_0_40px_#7f00ff]"
                : "border-purple-900"}
            bg-white/5 backdrop-blur-lg transition hover:-translate-y-2`}
          >
            {plan.highlight && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-xs px-4 py-1 rounded-full">
                MOST POPULAR
              </span>
            )}

            <h3 className="text-2xl font-semibold text-purple-300">
              {plan.name}
            </h3>

            <p className="text-3xl font-bold mt-4">{plan.price}</p>

            <ul className="mt-6 space-y-3 text-gray-300">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-purple-400">✔</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className="mt-8 w-full py-3 rounded-lg font-semibold
              bg-gradient-to-r from-purple-600 to-fuchsia-600
              hover:opacity-90 transition"
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
