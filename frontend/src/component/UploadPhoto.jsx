// src/pages/ProfileImageUpload.jsx
import { useState } from "react";
import { Camera } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";

export default function ProfileImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);

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

    try {
      //  Get Cloudinary signature
      const { data: uploadCredentials } = await axiosClient.get(
        "/auth/uploadImage"
      );

      //  Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", uploadCredentials.api_key);
      formData.append("timestamp", uploadCredentials.timestamp);
      formData.append("signature", uploadCredentials.signature);
      formData.append("public_id", uploadCredentials.public_id);
      formData.append("folder", uploadCredentials.folder);

      const uploadResponse = await fetch(uploadCredentials.upload_url, {
        method: "POST",
        body: formData,
      });

      const cloudinaryResult = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(cloudinaryResult.error?.message);

      console.log("Cloudinary Result:", cloudinaryResult);

      // Save metadata to backend
      const saveResponse = await axiosClient.post("/auth/saveImage", {
        public_id: cloudinaryResult.public_id,
        secure_url: cloudinaryResult.secure_url, // backend expects this
      });

      console.log("Saved:", saveResponse.data);

      setSuccess(true);
      setSelectedFile(null);
      setPreview(null);
      setTimeout(() => setSuccess(false), 2000);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-700">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Upload Profile Image
          </h2>
          <Camera className="ml-3 text-purple-400" size={28} />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full mb-4 px-4 py-3 bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 cursor-pointer transition-all"
          disabled={uploading}
        />

        {preview && (
          <div className="mb-6 flex flex-col items-center">
            <p className="text-slate-300 text-sm mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-full border-4 border-purple-500 object-cover"
            />
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
            Upload successful!
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        <p className="mt-4 text-xs text-slate-400 text-center">
          Max file size: 5MB • Supported: JPG, PNG, GIF, WebP
        </p>
      </div>
    </div>
  );
}
