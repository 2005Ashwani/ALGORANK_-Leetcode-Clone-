import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Tree_Graph() {
  const [animate, setAnimate] = useState(false);
  const location = useLocation();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Determine if we are on the main /tree-graph route or home page
  const isMainPage = location.pathname === "/tree-graph" || location.pathname === "/";


  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);



  // hading animation
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100); // slight delay
    return () => clearTimeout(timer);
  }, []);


  // text animation
    useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div

      className="two-box flex justify-center items-center flex-col bg-base-100 min-h-screen overflow-hidden mt-0">
      {isMainPage && (
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center py-4 sm:py-12">
    


            <h1
      className={`text-4xl sm:text-5xl font-extrabold text-center mb-20 transition-all duration-1000 ease-in-out transform
        ${animate ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90"}`}
    >
      <span className="text-base-content">LEARN </span>
      <span className="text-purple-600 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
        TREE
      </span>
      <span className="text-base-content"> & </span>
      <span className="text-blue-600 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
        GRAPH
      </span>
    </h1>

          <nav className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-12 w-full">
            {/* SEARCHING Block */}
            <Link
              to="tree"
              className={`w-full sm:w-[45%] max-w-md h-48 sm:h-64 md:h-80 rounded-3xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center relative overflow-hidden group
            ${animate ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"} 
            transform transition-all duration-700 ease-out delay-150`}
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white z-10 transform group-hover:scale-110 transition-transform duration-300">
                TREE
              </h2>
              <div className="absolute bottom-4 left-4 text-white/80 text-sm sm:text-base">
                Click to explore
              </div>
              <div className="absolute top-4 right-4 text-white/80 text-xs sm:text-sm">
                DFS + BFS + MORE...
              </div>
            </Link>

            {/* SORTING Block */}
            <Link
              to="graph"
              className={`w-full sm:w-[45%] max-w-md h-48 sm:h-64 md:h-80 rounded-3xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center relative overflow-hidden group
            ${animate ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"} 
            transform transition-all duration-700 ease-out`}
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white z-10 transform group-hover:scale-110 transition-transform duration-300">
                GRAPH

              </h2>
              <div className="absolute bottom-4 left-4 text-white/80 text-sm sm:text-base">
                Click to explore
              </div>
              <div className="absolute top-4 right-4 text-white/80 text-xs sm:text-sm">
                KRUSKAL + PRIM'S + MORE..
              </div>
            </Link>
          </nav>

          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-base-content/70 text-sm sm:text-base max-w-2xl mx-auto">
              Interactive visualization of tree and graph data structures with animations and step-by-step explanations.
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