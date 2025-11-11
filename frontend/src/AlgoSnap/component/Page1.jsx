
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

export default function Page1() {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  // Updated paths to match actual route paths
  const Random_Function_Call = [
    { id: 1, path: "/array-linkedlist" },
    { id: 2, path: "/searching-sorting" },
    { id: 3, path: "/tree-graph" },
  ];

  // Trigger animation on load
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Navigate to a random path
  const handleRandomNavigate = () => {
    const randomIndex = Math.floor(Math.random() * Random_Function_Call.length);
    const randomRoute = Random_Function_Call[randomIndex].path;

    // Debug: Check the selected path
    console.log("Navigating to:", randomRoute);

    navigate(randomRoute);
  };

  return (
    <div>
      <Navigation />

      <div className="min-h-screen w-full bg-base-200 text-base-content flex items-center justify-center px-4 overflow-x-hidden pb-12 pt-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1
            className={`text-4xl md:text-5xl font-extrabold text-base-content leading-tight
              transition-all duration-700 ease-out
              ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Visualize <span className="text-primary">Data Structures</span>{" "}
            <br />
            & Algorithms Like Never Before
          </h1>

          <p
            className={`mt-6 text-lg md:text-xl text-base-content/70
              transition-all duration-700 ease-out delay-200
              ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Interactive animations, step-by-step breakdowns, <br />
            and instant code insight.
          </p>

          <button
            onClick={handleRandomNavigate}
            className={`btn btn-primary mt-8 px-6 py-3 text-lg font-medium shadow-md hover:shadow-xl
              transform transition-all ease-out duration-700 delay-300
              ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Start Visualizing
          </button>
        </div>
      </div>
    </div>
  );
}
