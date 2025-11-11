import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Editorial({ problem }) {
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);

  const [video, setVideo] = useState(null);
  const [like, setLike] = useState(0);
  const [disLike, setDisLike] = useState(0);
  const [Comments, setComments] = useState([]);
  const [status, setStatus] = useState("pending");
  const [commentInput, setCommentInput] = useState("");

  // Fetch The Video
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axiosClient.get(`/video/${problem._id}`);
        setStatus(response.data.status);
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [problem._id]);

  // to get the like and dislike count from the backend
  const fetchLikes = async () => {
    if (!video) return;

    try {
      const response = await axiosClient.get(`/video/like/${video._id}`);
      setLike(response.data.likes);
      setDisLike(response.data.disLike);
      setComments(Array.isArray(response.data.comments) ? response.data.comments : []);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [video?._id]);

  return (
    <div className="min-h-screen bg-base-200 p-4" data-theme={theme}>
      {status === "created" ? (
        <div className="max-w-4xl mx-auto">
          {/* Problem Title */}
          <h1 className="text-center text-3xl font-bold text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent p-4 rounded-xl shadow-lg mb-6">
            {problem.tittle}
          </h1>

          <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-base-300">
            <div className="flex flex-col items-center">
              {video ? (
                <div className="w-full max-w-2xl">
                  {/* Video */}
                  <video
                    src={video.secureUrl}
                    poster={video.thumbnailUrl}
                    controls
                    className="w-full rounded-2xl shadow-lg border border-base-300 mb-6"
                  />

                  {/* Like / Dislike Buttons */}
                  <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-4 bg-base-200 px-6 py-3 rounded-full shadow-md">
                      {/* Like Button */}
                      <button
                        className="btn btn-success btn-sm gap-2 hover:scale-105 transition-transform"
                        onClick={async () => {
                          try {
                            await axiosClient.post(`/video/like/${video._id}`, {
                              like: like + 1,
                              dislikes: disLike,
                            });
                            fetchLikes(); // Refetch to update UI
                          } catch (error) {
                            console.error("Error liking video:", error);
                          }
                        }}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-semibold">{like}</span>
                      </button>

                      {/* Dislike Button */}
                      <button
                        className="btn btn-error btn-sm gap-2 hover:scale-105 transition-transform"
                        onClick={async () => {
                          try {
                            await axiosClient.post(`/video/like/${video._id}`, {
                              like: like,
                              dislikes: disLike + 1,
                            });
                            fetchLikes(); // Refetch to update UI
                          } catch (error) {
                            console.error("Error disliking video:", error);
                          }
                        }}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="font-semibold">{disLike}</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="w-full">
                    <h3 className="text-xl font-semibold text-base-content mb-4">Comments</h3>
                    <div className="space-y-3 mb-6">
                      {Comments.length > 0 ? (
                        Comments.map((comment, index) => (
                          <div key={index} className="bg-base-200 p-3 rounded-lg shadow-sm border border-base-300">
                            <p className="text-base-content text-sm">{comment}</p>
                          </div>
                        ))
                      ) : (
                        <div className="bg-base-200 p-3 rounded-lg shadow-sm border border-base-300">
                          <p className="text-base-content/60 text-sm">No comments yet. Be the first to comment!</p>
                        </div>
                      )}
                    </div>

                    {/* Input Box */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="input input-bordered flex-1"
                      />
                      <button
                        className="btn btn-primary"
                        onClick={async () => {
                          if (!commentInput.trim()) return;
                          try {
                            await axiosClient.post(`/video/like/${video._id}`, {
                              comment: commentInput,
                            });
                            setCommentInput(""); // Clear input
                            fetchLikes(); // Refetch to update UI
                          } catch (error) {
                            console.error("Error posting comment:", error);
                          }
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center py-8">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <span className="ml-2 text-base-content">Loading video...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen bg-base-200 text-base-content space-y-6">
          {/* Lock Icon */}
          <div className="bg-base-100 p-6 rounded-full shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm6-10a4 4 0 00-8 0v4h8v-4z"
              />
            </svg>
          </div>

          {/* Text */}
          <h2 className="text-3xl font-bold text-base-content">Subscribe to unlock</h2>
          <p className="text-base-content/70 text-center max-w-md text-lg">
            Thanks for using{" "}
            <span className="font-semibold text-primary">AlgoRank</span>! To view
            this solution you must subscribe to premium.
          </p>

          {/* Subscribe Button */}
          <button
            className="btn btn-warning btn-lg hover:scale-105 transition-transform shadow-lg"
            onClick={() =>
              navigate("/Payment", { state: { problem_ID: problem._id } })
            }
          >
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
}
