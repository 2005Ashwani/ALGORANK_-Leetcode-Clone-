import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { motion } from "framer-motion"; // For smooth animations
import { MdDeleteForever } from "react-icons/md"; // For a modern delete icon
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RemoveProblem() {
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);

  const [allProblem, setAllProblem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // To track which problem is being deleted

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

  // Handle problem deletion
  const handleDeleteProblem = async (problemId) => {
    setDeletingId(problemId); // Set the ID of the problem being deleted
    console.log(problemId);
    if (!window.confirm("Are you sure want to delete this problem?")) return;

    try {
      await axiosClient.delete(`/problem/delete/${problemId}`);
      // Filter out the deleted problem from the state
      setAllProblem((prevProblems) =>
        prevProblems.filter((problem) => problem._id !== problemId)
      );
      console.log(`Problem ${problemId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting problem ${problemId}:`, error);
      setError(`Failed to delete problem: ${problemId}`);
    } finally {
      setDeletingId(null); // Reset deleting ID
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
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { ease: "easeOut", duration: 0.3 },
    },
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 text-base-content font-sans p-6">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center text-4xl font-extrabold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse drop-shadow-lg"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Remove Problem
      </motion.h1>

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
            className="text-2xl text-indigo-300 tracking-wide"
          >
            Loading problems...
          </motion.p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      ) : allProblem.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-4" // Increased max-width
        >
          {allProblem.map((problem, index) => (
            <motion.div
              key={problem._id}
              variants={itemVariants}
              layout // Enable layout animations for smooth removal
              className="card bg-base-100 rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between transition-all duration-300 hover:shadow-2xl border border-base-300 group" // Added group for hover effects
            >
              <button
                className="flex items-center flex-grow cursor-pointer text-left py-2 px-3 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 w-full sm:w-auto"
                onClick={() => navigate(`/problem/${problem._id}`)}
              >
                <p className="text-gray-400 font-medium mr-4 min-w-[30px] text-center">
                  <span className="text-purple-300">#</span>
                  {index + 1}
                </p>
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <p className="text-white font-semibold text-lg truncate col-span-1 sm:col-span-2">
                    <span className="text-indigo-300">Title:</span>{" "}
                    {problem.tittle}
                  </p>
                  <div className="flex items-center space-x-4 col-span-1 sm:col-span-1 justify-end sm:justify-start">
                    <p className="text-gray-300 whitespace-nowrap">
                      <span className="text-indigo-400">Tags:</span>{" "}
                      <span className="bg-gray-700 px-2 py-1 rounded-full text-sm font-mono group-hover:bg-gray-600 transition-colors">
                        {problem.tags}
                      </span>
                    </p>
                    <p className="text-gray-300 whitespace-nowrap">
                      <span className="text-indigo-400">Difficulty:</span>{" "}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          problem.difficulty === "easy"
                            ? "bg-green-600 text-green-100"
                            : problem.difficulty === "medium"
                            ? "bg-yellow-600 text-yellow-100"
                            : "bg-blue-600 text-red-100"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </p>
                  </div>
                </div>
              </button>

              <motion.button
                onClick={() => handleDeleteProblem(problem._id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`ml-0 mt-4 sm:mt-0 sm:ml-6 flex-shrink-0 flex items-center px-4 py-2 rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 min-w-[120px] justify-center cursor-pointer btn btn-error ${
                  deletingId === problem._id
                    ? "btn-disabled"
                    : ""
                }`}
                disabled={deletingId === problem._id}
              >
                {deletingId === problem._id ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <MdDeleteForever className="text-xl mr-2" />
                    Delete
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-2xl text-gray-400">No problems found to remove.</p>
        </div>
      )}
    </div>
  );
}
