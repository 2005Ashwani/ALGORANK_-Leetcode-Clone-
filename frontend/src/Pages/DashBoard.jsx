import { Globe, Github, Linkedin, Twitter } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DashBoard() {
  const [isLoading, setIsLoading] = useState(false);
  const [getProfile, setGetProfile] = useState({}); // To Get the profile
  const [SolvedProblem, setSolvedProblem] = useState([]); // Setting all the problem - Initialized as an empty array // Initializing with [] is safer for map operations
  const [totalProblem, setTotalProblem] = useState();
  const [easy, setEasy] = useState([]);
  const [medium, setMedium] = useState([]);
  const [hard, setHard] = useState([]);

  // Me
  const [matched, setMatched] = useState();

  const navigate = useNavigate();

  // To get the profile (Runs once on mount)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get("/auth/getProfile");
        const profileData = response.data;
        setGetProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data.");
        // If profile fetch fails, we'll stop the loading state here.
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  //  Get All the problems and filter the solved ones (Runs when getProfile updates)
  useEffect(() => {
    // Only proceed if getProfile has been successfully loaded and has problemSolved data
    if (getProfile && getProfile.problemSolved) {
      const fetchProblem = async () => {
        try {
          // Set loading state here, as this is where problem data is fetched
          setIsLoading(true);

          const data = await axiosClient.get("/problem/getAllProblem");

          //  Compute the solved problems array immediately
          const allProblems = data.data || [];
          const solvedProblemIds = getProfile.problemSolved || [];

          // Storing the total Problem
          setTotalProblem(allProblems);

          const prom = allProblems.filter((item) =>
            solvedProblemIds.includes(item._id)
          );

          //  Update the SolvedProblem state
          setSolvedProblem(prom);

          //  Filter solved problems by difficulty using the 'prom' array, not the state
          const easy = prom.filter((item) => item.difficulty === "easy");
          const medium = prom.filter((item) => item.difficulty === "medium");
          const hard = prom.filter((item) => item.difficulty === "hard");

          //  Update difficulty states
          setEasy(easy);
          setMedium(medium);
          setHard(hard);
        } catch (error) {
          console.error("Failed to fetch Submitted Problem:", error);
          toast.error("Failed to load Submitted Problems.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProblem();
    } else if (getProfile && Object.keys(getProfile).length > 0) {
      // If profile loaded but has no problemSolved array (or it's an empty object), just set loading to false
      setIsLoading(false);
    }
  }, [getProfile]);

  // To Get the Submitted Problem

  useEffect(() => {
    const fetchSubmittionProblem = async () => {
      try {
        const data = await axiosClient.get("/submission/getSubmittedProblem");
        const submissions = data.data;

        // Filtered problem
        const matchedProblems = submissions.filter(
          (sub) => String(sub.userId) === String(getProfile._id)
        );

        // Update state with matched problems
        setMatched(matchedProblems);
      } catch (error) {
        console.log("Error fetching submissions:", error);
      }
    };

    // Only run if profile & problems are available
    if (getProfile && SolvedProblem.length > 0) {
      fetchSubmittionProblem();
    }
  }, [getProfile, SolvedProblem]);

  //  To Print
  useEffect(() => {
    console.log("Kar chuka HUn", matched);
  }, [matched, getProfile]); //

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-6" data-theme={useSelector((state) => state.theme.theme)}>
      {isLoading === false ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Profile Card */}
          <div className="bg-base-100 p-6 rounded-2xl shadow-xl w-full lg:w-1/4 border border-base-300">
            <div className="flex flex-col items-center text-center">
              <img
                src={getProfile.profileImage}
                alt="profile"
                className="w-24 h-24 rounded-full border-4 border-primary shadow-lg mb-4"
              />

              <h2 className="text-xl font-bold text-base-content">
                {getProfile.firstName} {getProfile.lastName}
              </h2>

              <p className="text-base-content/70 mb-2">{getProfile.email}</p>

              <p className="text-sm text-base-content/60 mb-4">
                Passionate about coding and web development
              </p>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/edit")}
              >
                Edit Profile
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>India</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎓</span>
                <span>ABSS Institute Of Technology Meerut</span>
              </div>
              <a
                href="https://ashwanitech.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Globe size={16} /> Portfolio
              </a>
              <div className="flex gap-3 mt-2">
                <Github className="cursor-pointer hover:scale-110 transition-transform" size={18} />
                <Twitter className="cursor-pointer hover:scale-110 transition-transform" size={18} />
                <Linkedin className="cursor-pointer hover:scale-110 transition-transform" size={18} />
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {["Python", "C", "HTML", "CSS", "JavaScript"].map((lang) => (
                  <span
                    key={lang}
                    className="badge badge-outline text-xs"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-base-300 pt-4">
              <h3 className="font-semibold mb-2 text-base-content">Community Stats</h3>
              <div className="flex justify-between text-base-content/70 text-sm">
                <span>Views</span>
                <span>0</span>
              </div>
              <div className="flex justify-between text-base-content/70 text-sm">
                <span>Solutions</span>
                <span>0</span>
              </div>
            </div>
          </div>

          {/* Right Dashboard Content */}
          <div className="flex-1 space-y-6">
            {/* Progress + Rank Section */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Problems Solved */}
              <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xl flex-1 min-w-[300px] flex flex-col lg:flex-row justify-around items-center">
                {/* Problem Solved Section */}
                <div className="flex flex-col items-center justify-center p-4">
                  <h3 className="text-base-content font-semibold mb-6 uppercase tracking-wider text-lg">
                    Problems Solved
                  </h3>

                  {/* Interactive Total Problem Circle */}
                  <div className="relative w-48 h-48 group">
                    <div className="absolute inset-0 rounded-full border-[8px] border-warning flex flex-col items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                      <span className="text-4xl font-extrabold text-base-content leading-none">
                        {getProfile?.problemSolved?.length}
                      </span>
                      <span className="text-lg font-medium text-base-content/70">
                        / {totalProblem?.length}
                      </span>
                    </div>

                    <div className="absolute inset-0 rounded-full bg-base-200 border-[8px] border-base-300 flex flex-col items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition duration-300 transform scale-95 group-hover:scale-100">
                      <p className="text-sm font-bold text-success mb-1">
                        Easy: <span className="text-xl">{easy?.length}</span>
                      </p>
                      <p className="text-sm font-bold text-warning mb-1">
                        Medium: <span className="text-xl">{medium?.length}</span>
                      </p>
                      <p className="text-sm font-bold text-error">
                        Hard: <span className="text-xl">{hard?.length}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Difficulty Stats Section */}
                <div className="flex flex-col gap-4 pt-4">
                  <h3 className="text-base-content/70 font-medium text-center uppercase text-sm tracking-widest">
                    Difficulty Stats
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="h-16 w-40 p-2 text-lg flex justify-center items-center bg-base-200 hover:bg-success/20 transition text-success rounded-xl shadow-md">
                      <p>
                        Easy: <span className="font-bold">{easy?.length}</span>
                      </p>
                    </div>
                    <div className="h-16 w-40 p-2 text-lg flex justify-center items-center bg-base-200 hover:bg-warning/20 transition text-warning rounded-xl shadow-md">
                      <p>
                        Medium: <span className="font-bold">{medium?.length}</span>
                      </p>
                    </div>
                    <div className="h-16 w-40 p-2 text-lg flex justify-center items-center bg-base-200 hover:bg-error/20 transition text-error rounded-xl shadow-md">
                      <p>
                        Hard: <span className="font-bold">{hard?.length}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rank Card */}
              <div className="bg-base-100 border border-base-300 rounded-2xl p-6 w-full lg:w-64 flex justify-center items-center shadow-xl">
                <div className="flex flex-col justify-center items-center bg-base-200 w-48 h-48 rounded-full border-[6px] border-warning shadow-lg">
                  <h1 className="font-semibold text-2xl text-base-content">Rank</h1>
                  <h3 className="text-3xl font-bold text-base-content">
                    ~
                    {SolvedProblem[0]?.difficulty === "easy"
                      ? Math.ceil(
                          (SolvedProblem?.length / totalProblem?.length) *
                            100 *
                            1
                        )
                      : SolvedProblem[0]?.difficulty === "medium"
                      ? Math.ceil(
                          (SolvedProblem?.length / totalProblem?.length) *
                            100 *
                            3
                        )
                      : Math.ceil(
                          (SolvedProblem?.length / totalProblem?.length) *
                            100 *
                            5
                        )}
                  </h3>
                </div>
              </div>
            </div>

            {/* Activity Calendar */}
            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold mb-2 text-base-content text-xl">
                Submissions in the Past Year
              </h3>
              <p className="text-base-content/70 mb-3">Total Active Days: 1</p>
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 bg-base-300 rounded-sm hover:bg-success transition-all"
                  ></div>
                ))}
              </div>
            </div>

            {/* Recent AC Submissions */}
            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-2xl text-base-content">
                  Recent Accepted Solutions
                </h3>
                <button className="btn btn-ghost text-primary hover:underline">
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {/* Display All Problems */}
                <div className="flex flex-col gap-4">
                  {SolvedProblem.length > 0 ? (
                    SolvedProblem.map((problemItem) => (
                      <div
                        key={problemItem._id}
                        className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center p-4 min-h-16 border border-base-300"
                      >
                        <div className="card-body flex flex-row items-center justify-between p-0 w-full">
                          {/* Problem Title with Link */}
                          <button
                            className="card-title text-lg font-semibold mr-4 text-success hover:text-success-focus whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer"
                            onClick={() =>
                              navigate(`/problem/${problemItem._id}`)
                            }
                          >
                            {problemItem?.tittle}
                          </button>

                          {/* Difficulty */}
                          <div className="text-lg font-medium w-20 text-right text-base-content">
                            {problemItem.difficulty}
                          </div>

                          {/* Time */}
                          <div className="text-sm text-base-content/70 w-32 text-right">
                            {(() => {
                              const matchedItem = matched?.find(
                                (item) =>
                                  item.userId === getProfile._id &&
                                  item.problemId === problemItem._id
                              );

                              if (matchedItem) {
                                const date = new Date(matchedItem.updatedAt);
                                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                              }

                              return "-";
                            })()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 bg-base-200 rounded-lg shadow-md border border-base-300">
                      <p className="text-xl text-info font-medium">
                        No problems solved yet. Start coding!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
    </div>
  );
}
