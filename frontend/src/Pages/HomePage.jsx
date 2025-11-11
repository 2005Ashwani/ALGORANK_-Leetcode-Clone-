import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../redux/authSlice";
import { useEffect, useState } from "react";
// Renamed the icon for clarity in the context of dark/light mode
import { Sun, Moon } from "lucide-react";
import { toggleTheme } from "../redux/Theme";

function HomePage() {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Reading the theme from Redux state (which is a string: 'light' or 'dark')
  const { theme } = useSelector((state) => state.theme); 

  const [problem, setProblem] = useState([]);
  const [solvedProblem, setSolvedProblem] = useState([]);
  const [filter, setFilter] = useState({
    difficulity: "all",
    tag: "all",
    status: "all",
  });

  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(5);

  // Fetch all problems ONCE
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblem(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblem(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // Logout
  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblem([]);
  };

  // Filtering logic with search
  const filteredProblems = problem.filter((p) => {
    // Search filter - check if title includes search term
    const searchMatch =
      search.trim() === "" ||
      p.tittle.toLowerCase().includes(search.toLowerCase());

    // Difficulty filter
    const difficultyMatch =
      filter.difficulity === "all" || p.difficulty === filter.difficulity;

    // Tag filter
    const tagMatch = filter.tag === "all" || p.tags === filter.tag;

    // Status filter (solved/unsolved)
    const isSolved = solvedProblem.some((sp) => sp._id === p._id);
    const statusMatch =
      filter.status === "all" ||
      (filter.status === "solved" && isSolved) ||
      (filter.status === "unsolved" && !isSolved);

    return searchMatch && difficultyMatch && tagMatch && statusMatch;
  });

  // Frontend Pagination Logic
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
  const startIndex = (currentPage - 1) * problemsPerPage;
  const currentProblems = filteredProblems.slice(
    startIndex,
    startIndex + problemsPerPage
  );

  // Theme Toggle Function: Dispatches the Redux action
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // UI
  return (
    // 1. **Apply the theme using data-theme**
    <div 
        className="min-h-screen bg-base-200" 
        data-theme={theme} // Uses 'light' or 'dark' 
    >
      {/* Navbar */}
      <nav
        className="navbar shadow-lg px-6 sticky top-0 z-50 bg-base-100"
      >
        <div className="flex items-center justify-between w-full">
          {/* Left Section – Logo */}
          <div className="flex items-center gap-2">
            <NavLink to="/" className="btn btn-ghost text-2xl font-extrabold">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                AlgoRank
              </span>
            </NavLink>
          </div>

          {/* Center Section – Links */}
          <div className="hidden md:flex items-center gap-8 text-lg font-medium text-base-content">
            <NavLink
              to="/page1"
              className="hover:text-primary transition-colors duration-200"
            >
              Learn DSA
            </NavLink>
          </div>

          {/* Right Section – Theme + Profile */}
          <div className="flex items-center gap-5">
            {/* Mode Toggle */}
            {/* 🛑 FIX 1: Use handleToggleTheme function */}
            <button onClick={handleToggleTheme}> 
              {/* 🛑 FIX 2: Use theme string from Redux for conditional icon rendering */}
              {theme === 'light' ? ( 
                <Moon className="cursor-pointer hover:scale-110 transition-transform duration-200" />
              ) : (
                <Sun className="cursor-pointer hover:scale-110 transition-transform duration-200" />
              )}
            </button>

            {/* Profile Image / Auth Buttons */}
            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  // Simplified hover classes for dark/light mode consistency
                  className="flex items-center gap-2 btn btn-ghost px-2 py-1 rounded-xl hover:bg-base-300 transition"
                >
                  <img
                    src={user.profileImage}
                    alt="User profile"
                    className="h-10 w-10 rounded-full object-cover object-[50%_60%] border-2 border-base-300 shadow-sm hover:scale-105 transition-transform duration-200"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-base-content" 
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  {user.role === "admin" && (
                    <li>
                      <NavLink
                        className="btn btn-sm btn-ghost w-full justify-start text-base"
                        to="/adminpage"
                      >
                        Admin
                      </NavLink>
                    </li>
                  )}

                  <li>
                    <NavLink
                      to="/dashBoard"
                      className="btn btn-sm btn-ghost w-full justify-start text-base"
                    >
                      Dashboard
                    </NavLink>
                  </li>

                  {user.role === "admin" && (
                    <li>
                      <NavLink
                        to="/signAdmin"
                        className="btn btn-sm btn-ghost w-full justify-start text-base"
                      >
                        Create Admin
                      </NavLink>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn btn-sm btn-ghost w-full justify-start text-base"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login" className="btn btn-primary btn-sm">
                  Login
                </NavLink>
                <NavLink to="/register" className="btn btn-secondary btn-sm">
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Filters */}
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-center gap-8 mb-8 bg-base-100 p-5 rounded-lg shadow-md items-center">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by problem name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // Updated input class to use DaisyUI's base styles
            className="input input-bordered w-full max-w-[250px]"
          />

          <select
            // Updated select class to use DaisyUI's base styles
            className="select select-bordered w-full max-w-[180px] text-base"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>

          <select
            // Updated select class to use DaisyUI's base styles
            className="select select-bordered w-full max-w-[180px] text-base"
            value={filter.difficulity}
            onChange={(e) =>
              setFilter({ ...filter, difficulity: e.target.value })
            }
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            // Updated select class to use DaisyUI's base styles
            className="select select-bordered w-full max-w-[180px] text-base"
            value={filter.tag}
            onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="LinkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problem Cards */}
        <div className="flex flex-col gap-7">
          {problem.length === 0 ? (
            <div className="flex justify-center">
              <span className="loading loading-ring loading-lg"></span>
            </div>
          ) : currentProblems.length > 0 ? (
            currentProblems.map((problemItem) => (
              <div
                key={problemItem._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition"
              >
                <div className="card-body">
                  <button
                    className="card-title text-xl font-bold mb-2 text-success cursor-pointer hover:text-success-focus transition-colors duration-200"
                    onClick={() =>
                      (window.location.href = `/problem/${problemItem._id}`)
                    }
                  >
                    {problemItem.tittle}
                  </button>
                  <p className="text-base-content text-lg line-clamp-3 mb-4">
                    {problemItem.description}
                  </p>
                  <div className="card-actions justify-between">
                    <div
                      className={`badge ${
                        problemItem.difficulty === "easy"
                          ? "badge-success"
                          : problemItem.difficulty === "medium"
                          ? "badge-warning"
                          : "badge-error"
                      } badge-outline text-lg p-3`}
                    >
                      {problemItem.difficulty}
                    </div>
                    <div className="badge badge-info badge-outline text-lg p-3">
                      {problemItem.tags}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8">
              <p className="text-xl text-base-content">
                No problems found matching your search criteria.
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {currentProblems.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-primary"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`btn ${
                    currentPage === i + 1
                      ? "btn-active btn-primary"
                      : "btn-outline"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="btn btn-primary"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;