import { useParams } from "react-router-dom";
import axios from "axios";
import axiosClient from "../utils/axiosClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function AdminUpload() {
  const { problemId } = useParams();
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const { theme } = useSelector((state) => state.theme);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const onSubmit = async (data) => {
    setErrorMsg(null);
    const file = data.videoFile && data.videoFile[0];
    if (!file) return setErrorMsg("Please select a video file");

    setUploading(true);
    setUploadProgress(0);

    try {
      // 1) get signature + upload url from backend
      const sigRes = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, upload_url } =
        sigRes.data;

      // 2) upload to Cloudinary using a proper FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", api_key);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      // ensure we pass the public_id so it's predictable
      if (public_id) formData.append("public_id", public_id);

      const uploadResp = await axios.post(upload_url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          if (!ev.total) return;
          const percent = Math.round((ev.loaded * 100) / ev.total);
          setUploadProgress(percent);
        },
      });

      const cloudinaryResult = uploadResp.data;

      // 3) save metadata to backend
      const saveResp = await axiosClient.post(`/video/save`, {
        cloudinaryPublicId: cloudinaryResult.public_id,
        publicId: cloudinaryResult.public_id,
        problemId,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(saveResp.data.videoSolution || cloudinaryResult);
      reset();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Framer Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Define theme-based classes
  const themeClasses = theme === 'dark'
    ? "min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-gray-100"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 text-gray-900";

  return (
    <div className={`${themeClasses} font-sans p-6`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto"
      >
        <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-gray-800 via-gray-900 to-black' : 'from-white via-gray-50 to-gray-100'} rounded-2xl shadow-2xl p-6 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} backdrop-blur-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-purple-700/30`}>
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold text-center text-transparent bg-clip-text ${theme === 'dark' ? 'bg-gradient-to-r from-purple-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-600 to-purple-700'}`}>
              Upload Your Video 🎥
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* File Input */}
              <div className="form-control w-full">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Choose a video file
                  </span>
                </label>
                <input
                  type="file"
                  accept="video/*"
                  {...register("videoFile", { required: true })}
                  className={`file-input w-full text-sm border-2 border-dashed transition-all duration-300 cursor-pointer ${
                    theme === 'dark'
                      ? 'text-gray-200 border-indigo-500 bg-gray-900 hover:border-purple-500 hover:bg-gray-800'
                      : 'text-gray-800 border-indigo-400 bg-gray-50 hover:border-purple-600 hover:bg-gray-100'
                  }`}
                  disabled={uploading}
                />
                {errors.videoFile && (
                  <label className="label">
                    <span className="label-text-alt text-red-400">
                      ⚠️ Please select a file
                    </span>
                  </label>
                )}
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2 animate-pulse">
                  <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}>
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className={`alert shadow-lg animate-fade-in ${theme === 'dark' ? 'bg-red-900/40 border-red-600 text-red-300' : 'bg-red-100 border-red-400 text-red-700'}`}>
                   {errorMsg}
                </div>
              )}

              {/* Success Message */}
              {uploadedVideo && (
                <div className={`alert shadow-lg animate-fade-in ${theme === 'dark' ? 'bg-green-900/30 border-green-600 text-green-300' : 'bg-green-100 border-green-400 text-green-700'}`}>
                  <div>
                    <h3 className="font-bold text-lg">✅ Upload Successful!</h3>
                    <p className="text-sm opacity-80">
                      Duration: {uploadedVideo.duration}
                    </p>
                    <p className="text-sm opacity-80">
                      Uploaded:{" "}
                      {new Date(
                        uploadedVideo.uploadedAt || Date.now()
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`cursor-pointer px-5 py-2.5 font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 hover:shadow-purple-600/50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    uploading ? "opacity-70 cursor-not-allowed " : ""
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Uploading...
                    </span>
                  ) : (
                    "Upload Video"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
