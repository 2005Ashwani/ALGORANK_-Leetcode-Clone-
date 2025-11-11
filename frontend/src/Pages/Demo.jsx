import { useState } from "react";
import { Camera, Upload, Check, ArrowLeft, X } from "lucide-react";

export default function ProfileImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);

  // Simulate axiosClient for demo
  const axiosClient = {
    get: async () => ({
      data: {
        api_key: "demo_key",
        timestamp: Date.now(),
        signature: "demo_signature",
        public_id: "demo_public_id",
        folder: "demo_folder",
        upload_url: "https://api.cloudinary.com/v1_1/demo/image/upload"
      }
    }),
    post: async () => ({ data: { success: true } })
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setError("");
    setSuccess(false);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);
    setUploadProgress(0);

    try {
      // STEP 1: Get Cloudinary signature
      setUploadProgress(20);
      const { data: uploadCredentials } = await axiosClient.get("/auth/uploadImage");

      // STEP 2: Upload image to Cloudinary
      setUploadProgress(40);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", uploadCredentials.api_key);
      formData.append("timestamp", uploadCredentials.timestamp);
      formData.append("signature", uploadCredentials.signature);
      formData.append("public_id", uploadCredentials.public_id);
      formData.append("folder", uploadCredentials.folder);

      setUploadProgress(60);
      
      // Simulate upload for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadProgress(80);

      const cloudinaryResult = {
        public_id: "demo_id",
        secure_url: "https://demo.cloudinary.com/image.jpg"
      };

      console.log("Cloudinary Result:", cloudinaryResult);

      // STEP 3: Save metadata to backend
      const saveResponse = await axiosClient.post("/auth/saveImage", {
        public_id: cloudinaryResult.public_id,
        secure_url: cloudinaryResult.secure_url,
      });

      setUploadProgress(100);
      console.log("Saved:", saveResponse.data);

      setSuccess(true);
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        window.history.back();
      }, 2000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Image upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setError("");
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-700/50 transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-3xl">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all duration-200"
          disabled={uploading}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8 mt-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl mb-4 shadow-lg shadow-purple-500/30 transform transition-all duration-300 hover:scale-110">
            <Camera className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
            Upload Profile Photo
          </h2>
          <p className="text-slate-400 text-sm mt-2">Choose your best picture</p>
        </div>

        {/* File Input Area */}
        <div className="relative mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={uploading}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-40 px-4 py-8 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-dashed rounded-2xl transition-all duration-300 ${
              uploading
                ? "border-slate-700 cursor-not-allowed opacity-50"
                : "border-purple-500/50 hover:border-purple-400 hover:bg-slate-800/80 cursor-pointer hover:scale-105"
            }`}
          >
            <Upload className="text-purple-400 mb-3" size={40} />
            <p className="text-slate-300 font-medium mb-1">
              {selectedFile ? selectedFile.name : "Click to upload"}
            </p>
            <p className="text-slate-500 text-xs">or drag and drop</p>
          </label>
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="mb-6 flex flex-col items-center animate-fadeIn">
            <p className="text-slate-300 text-sm mb-3 font-medium">Preview</p>
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 rounded-full border-4 border-purple-500 object-cover shadow-xl shadow-purple-500/30 transition-all duration-300 group-hover:scale-105"
              />
              {!uploading && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="mb-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-sm font-medium">Uploading...</span>
              <span className="text-purple-400 text-sm font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-purple-500/50"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-900/30 backdrop-blur-sm border-2 border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 animate-fadeIn">
            <X className="text-red-400 flex-shrink-0" size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 bg-green-900/30 backdrop-blur-sm border-2 border-green-500/50 text-green-200 px-4 py-3 rounded-xl flex items-center gap-3 animate-fadeIn">
            <Check className="text-green-400 flex-shrink-0" size={20} />
            <span className="text-sm font-medium">Upload successful! Redirecting...</span>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading || success}
          className={`w-full font-semibold py-4 rounded-xl transition-all duration-300 transform ${
            !selectedFile || uploading || success
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95"
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </span>
          ) : success ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={20} />
              Completed
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Upload size={20} />
              Upload Image
            </span>
          )}
        </button>

        {/* Info Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Max file size: <span className="text-purple-400 font-medium">5MB</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supported: <span className="text-purple-400 font-medium">JPG, PNG, GIF, WebP</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}