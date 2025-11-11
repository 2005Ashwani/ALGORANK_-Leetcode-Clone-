import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence for smoother transitions
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";

export default function AdminVideo() {
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);

  const [allProblem, setAllProblem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  // Get all the Problem
  const getAllProblem = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/problem/getAllProblem");
      setAllProblem(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching problems:", error);
      setError("Failed to load problems. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Run this once when the component mounts
  useEffect(() => {
    getAllProblem();
  }, []);

  // Framer Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { ease: "easeOut", duration: 0.3 },
    },
  };

  // Handle problem deletion
  const handleDeleteProblem = async (problemId) => {
    setDeletingId(problemId); // Set the ID of the problem being deleted
    console.log(problemId);
    if (!window.confirm("Are you sure want to delete this problem?")) return;

    try {
      await axiosClient.delete(`/video/delete/${problemId}`);
      // Filter out the deleted problem from the state
      setAllProblem((prevProblems) =>
        prevProblems.filter((problem) => problem._id !== problemId)
      );
      console.log(`Problem ${problemId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting problem ${problemId}:`, error);
      setError(error.response.data.error);
    } finally {
      setDeletingId(null); // Reset deleting ID
    }
  };

  useEffect(() => {
    console.log(deletingId);
  });

  // Define theme-based classes
  const themeClasses = theme === 'dark'
    ? "min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-gray-100"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 text-gray-900";

  return (
    <div className={`${themeClasses} font-sans p-6`}>
      {/* Page Title */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex justify-center text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-lg text-center ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Add Video to Problems
      </motion.h1>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className={`text-2xl tracking-wide ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}
          >
            Loading problems...
          </motion.p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className={`text-xl ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`}>{error}</p>
        </div>
      ) : allProblem.length > 0 ? (
        /* Problems List */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-5"
        >
          <AnimatePresence>
            {allProblem.map((problem, index) => (
              <motion.div
                key={problem._id}
                variants={itemVariants}
                layout
                className="bg-gray-800/90 backdrop-blur rounded-xl shadow-lg hover:shadow-indigo-800/40 p-5 flex flex-col sm:flex-row items-center justify-between transition-all duration-300 border border-gray-700 hover:border-indigo-500/40 group"
              >
                {/* Clickable Problem Info */}
                <button
                  className="flex items-center flex-grow cursor-pointer text-left py-2 px-3 rounded-lg hover:bg-gray-700/40 transition-colors duration-200 w-full sm:w-auto"
                  onClick={() => navigate(`/problem/${problem?._id}`)}
                >
                  <p className="text-gray-400 font-medium mr-4 min-w-[30px] text-center">
                    <span className="text-indigo-400">#</span>
                    {index + 1}
                  </p>

                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    {/* Problem Title */}
                    <p className="text-white font-semibold text-lg truncate col-span-1 sm:col-span-2 group-hover:text-indigo-300 transition-colors">
                      {problem?.tittle}
                    </p>

                    {/* Tags + Difficulty */}
                    <div className="flex flex-wrap gap-3 items-center col-span-1 sm:col-span-1 justify-end sm:justify-start">
                      <p className="text-gray-300 whitespace-nowrap text-sm">
                        <span className="text-indigo-400 font-semibold">
                          Tags:
                        </span>
                        <span
                          className={`${
                            problem.tags == "dp"
                              ? "bg-purple-700 text-white hover:bg-purple-400/60 "
                              : problem.tags == "array"
                              ? "bg-red-700 text-white hover:bg-red-500/60 "
                              : "bg-indigo-400 hover:bg-indigo-100/60 "
                          } px-3 py-1 rounded-full text-xs font-mono group-hover:bg-indigo-700/60 transition-colors ml-2`}
                        >
                          {problem?.tags}
                        </span>
                      </p>
                      <p className="text-gray-300 whitespace-nowrap text-sm">
                        <span className="text-indigo-400 font-semibold">
                          Difficulty:
                        </span>{" "}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                            problem.difficulty === "easy"
                              ? "bg-green-600/80 text-green-100"
                              : problem.difficulty === "medium"
                              ? "bg-yellow-600/80 text-yellow-100"
                              : "bg-red-600/80 text-red-100"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </p>
                    </div>
                  </div>
                </button>

                {/* Upload Button */}
                {/* Upload Button */}
                <div className="mt-4 sm:mt-0 sm:ml-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <NavLink to={`/admin/upload/${problem._id}`}>Upload</NavLink>
                </div>

                {/* Delete Button */}
                <button
                  className="mt-4 sm:mt-0 sm:ml-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer "
                  onClick={() => handleDeleteProblem(problem._id)}
                >
                  Delete
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className={`text-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No problems found.</p>
        </div>
      )}
    </div>
  );
}
