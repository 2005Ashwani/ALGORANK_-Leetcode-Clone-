import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";



export default function Payment() {
  const navigate = useNavigate();

  const location = useLocation();
  const { problem_ID } = location.state || {};
  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-white mb-12">Premium</h1>

      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 w-full max-w-4xl">
        {/* Yearly Subscription Card - Most Popular */}
        <div className="relative bg-gray-800 rounded-xl shadow-2xl p-8 flex flex-col justify-between border-2 border-teal-500 transform hover:scale-105 transition-transform duration-300">
          <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
            Most popular
          </span>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Yearly</h2>
            <p className="text-gray-400 text-sm">billed yearly ($179)</p>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Our <span className="text-white font-semibold">most popular</span>{" "}
              plan is valued at $299 and is now only{" "}
              <span className="text-teal-400 font-bold">$14.92/month</span>
            </p>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-5xl font-extrabold text-teal-400">$14.92/mo</h3>
            <p className="text-gray-500 text-xs mt-2">
              Prices are marked in USD
            </p>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              This plan{" "}
              <span className="font-semibold text-teal-400">
                saves you over 62%
              </span>{" "}
              in comparison to the monthly plan
            </p>
          </div>

          <button
            className="mt-8 w-full py-4 bg-teal-500 text-white font-bold rounded-lg shadow-lg hover:bg-teal-600 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
            onClick={() =>
              navigate("/razorpay", { state: { problem_ID: problem_ID ,subscriptioType:"year" } })
            }
          >
            Subscribe
          </button>
        </div>

        {/* Monthly Subscription Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Monthly</h2>
            <p className="text-gray-400 text-sm">billed monthly</p>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Our monthly plan grants access to{" "}
              <span className="text-white font-semibold">
                all premium features,
              </span>{" "}
              the best plan for short-term subscribers.
            </p>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-5xl font-extrabold text-white">$39/mo</h3>
            <p className="text-gray-500 text-xs mt-2">
              Prices are marked in USD
            </p>
          </div>

          <button className="mt-8 w-full py-4 bg-white text-gray-900 font-bold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
             onClick={() =>
              navigate("/razorpay", { state: { problem_ID, subscriptioType:"month" } })
            }
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
