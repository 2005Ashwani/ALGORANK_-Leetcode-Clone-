
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Tree_Graph() {
  const [animate, setAnimate] = useState(false);
  const location = useLocation();

  // Determine if we are on the main /array-linkedlist route or home page
  const isMainPage = location.pathname === "/array-linkedlist" || location.pathname === "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Text animation
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="two-box flex justify-center items-center flex-col bg-base-200 min-h-screen overflow-hidden">
      {isMainPage && (
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center py-4 sm:py-12">
          <h1
            className={`text-4xl sm:text-5xl font-extrabold text-center mb-20 transition-all duration-1000 ease-in-out transform
              ${animate ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90"}`}
          >
            <span className="text-base-content">LEARN </span>
            <span className="text-purple-400 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
              ARRAY
            </span>
            <span className="text-base-content"> & </span>
            <span className="text-blue-400 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
              LINKED LIST
            </span>
          </h1>

          <nav className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-12 w-full">
            {/* ARRAY Block */}
            <Link
              to="array"
              className={`w-full sm:w-[45%] max-w-md h-48 sm:h-64 md:h-80 rounded-3xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center relative overflow-hidden group
                ${animate ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"} 
                transform transition-all duration-700 ease-out delay-150`}
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)", // Darker purple gradient
                boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)", // Matching shadow
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white z-10 transform group-hover:scale-110 transition-transform duration-300">
                ARRAY
              </h2>
              <div className="absolute bottom-4 left-4 text-white/80 text-sm sm:text-base">
                Click to explore
              </div>
              <div className="absolute top-4 right-4 text-white/80 text-xs sm:text-sm">
                INSERTION + DELETION + MORE...
              </div>
            </Link>

            {/* LINKED LIST Block */}
            <Link
              to="linkedlist"
              className={`w-full sm:w-[45%] max-w-md h-48 sm:h-64 md:h-80 rounded-3xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center relative overflow-hidden group
                ${animate ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"} 
                transform transition-all duration-700 ease-out`}
              style={{
                background: "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)", // Teal gradient
                boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.4)", // Matching shadow
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white z-10 transform group-hover:scale-110 transition-transform duration-300">
                LINKED LIST
              </h2>
              <div className="absolute bottom-4 left-4 text-white/80 text-sm sm:text-base">
                Click to explore
              </div>
              <div className="absolute top-4 right-4 text-white/80 text-xs sm:text-sm">
                INSERTION + DELETION + MORE...
              </div>
            </Link>
          </nav>

          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-base-content/70 text-sm sm:text-base max-w-2xl mx-auto">
              Interactive visualization of array and linked list data structures with animations and step-by-step explanations.
            </p>
          </div>
        </div>
      )}

      {/* Show nested page */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Outlet />
      </div>
    </div>
  );
}
