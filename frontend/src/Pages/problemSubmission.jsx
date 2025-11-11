import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient"; // Assuming this is correctly configured

function ProblemSubmission({ problemId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]); // Changed to 'submissions' and initialized as an array
  const [error, setError] = useState(null); // To handle fetch errors

  const getSubmissionsForProblem = async (id) => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      console.log(`Fetching submissions for problemId: ${id}`);
      const response = await axiosClient.get(`/problem/submittedProblem/${id}`);
      // Assuming response.data is an array of submission objects
      setSubmissions(response.data);
      console.log(submissions);
    } catch (err) {
      console.error("Error fetching problem submissions:", err);
      setError("Failed to load submissions. Please try again.");
      setSubmissions([]); // Clear submissions on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if problemId is valid and not undefined/null
    if (problemId) {
      getSubmissionsForProblem(problemId);
    }
  }, [problemId]); // Re-run effect when problemId changes

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-white mb-6 text-center">
        My Submissions
      </h1>
      <h3 className="text-xl font-semibold text-gray-300 mb-8 text-center">
        Submission History for Problem
      </h3>

      {isLoading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
          <p className="ml-4 text-lg text-gray-300">Loading submissions...</p>
        </div>
      )}

      {error && (
        <div
          className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {!isLoading && !error && submissions.length === 0 && (
        <div
          className="bg-blue-800 border-l-4 border-blue-600 text-blue-100 p-4"
          role="alert"
        >
          <p className="font-bold">No Submissions Found</p>
          <p>
            It looks like you haven't submitted anything for this problem yet.
          </p>
        </div>
      )}

      {!isLoading && !error && submissions.length > 0 && (
        <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-700 border-b-2 border-gray-600 text-gray-200 text-left text-sm font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Language</th>
                <th className="px-5 py-3">Runtime</th>
                <th className="px-5 py-3">Memory</th>
                <th className="px-5 py-3">Test Cases</th>
                <th className="px-5 py-3">Submitted At</th>
                <th className="px-5 py-3">Code</th>{" "}
                {/* Column for viewing code */}
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission._id}
                  className="border-b border-gray-700 hover:bg-gray-600"
                >
                  <td className="px-5 py-5 text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight 
                      ${
                        submission.status === "Accepted"
                          ? "text-green-300"
                          : submission.status === "wrong"
                          ? "text-red-300" // Use 'wrong' as per your data
                          : "text-yellow-300"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 opacity-50 rounded-full 
                        ${
                          submission.status === ("Accepted"|"accepted")
                            ? "bg-green-700"
                            : submission.status === "wrong"
                            ? "bg-red-700"
                            : "bg-yellow-700"
                        }`}
                      ></span>
                      <span className="relative">{submission.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 text-sm text-gray-100">
                    {submission?.language}
                  </td>
                  <td className="px-5 py-5 text-sm text-gray-100">
                    {submission?.runtime} Sec
                  </td>
                  <td className="px-5 py-5 text-sm text-gray-100">
                    {submission?.memory} KB
                  </td>
                  <td className="px-5 py-5 text-sm text-gray-100">
                    {submission.testCasePassed}/{submission.testCaseTotal}
                  </td>
                  <td className="px-5 py-5 text-sm text-gray-100">
                    {new Date(submission.updatedAt).toLocaleString()}{" "}
                    {/* Using updatedAt for submission time */}
                  </td>
                  <td className="px-5 py-5 text-sm">
                    <button
                      onClick={() =>
                        alert(
                          `Code:\n${submission.code}\n\nError Message:\n${submission.errorMessage}`
                        )
                      }
                      className="text-white hover:text-white font-medium bg-gray-400 p-2 cursor-pointer text-xl rounded-2xl"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProblemSubmission;
