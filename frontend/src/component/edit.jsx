import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";


export default function EditProfile() {
  const { register, handleSubmit, reset } = useForm();
  const [getProfile, setGetProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useSelector((state) => state.theme);

  // Getting the detail of the profile and initializing form values
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get("/auth/getProfile");
        const profileData = response.data;
        setGetProfile(profileData);
        // Reset the form with the fetched data
        reset(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data.");
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axiosClient.post("/auth/edit", data);
      console.log(data);
    } catch (error) {
      console.log("Failed to update profile:", error);
    }
    setIsLoading(false);
  };

  return (
    <div data-theme={theme}>
      {isLoading == false ? (
        <div className="min-h-screen bg-base-100 text-base-content p-6">
          {/* Header Section */}
          <div className="max-w-5xl mx-auto">
            <div className={`bg-gradient-to-r ${theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-base-200 to-base-300'} rounded-xl p-6 shadow-lg flex items-center space-x-6`}>
              <NavLink to={`/uploadProfile`}>
                <img
                  src={getProfile.profileImage}
                  alt={getProfile.firstName}
                  className="w-24 h-24 rounded-full border-2 border-purple-500"
                />
              </NavLink>

              <div>
                <h1 className="text-2xl font-semibold">
                  {getProfile.firstName} {getProfile.lastName}
                </h1>
                <p className="text-gray-400">Role: {getProfile.role}</p>
                <p className="text-gray-400">
                  Problems Solved: {getProfile.problemSolved?.length || 0}
                </p>
              </div>
            </div>
            {/* Sidebar + Content */}
            <div className="flex mt-8 gap-6">
              {/* Sidebar */}
              <div className={`w-1/4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-base-200'} rounded-lg shadow-md p-4 space-y-4`}>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium">
                  Basic Info
                </button>
                <button className="w-full hover:bg-gray-700 py-2 rounded-lg text-gray-300">
                  Account
                </button>
                <button className="w-full hover:bg-gray-700 py-2 rounded-lg text-gray-300">
                  Security
                </button>
                <button className="w-full hover:bg-gray-700 py-2 rounded-lg text-gray-300">
                  Privacy
                </button>
                <button className="w-full hover:bg-gray-700 py-2 rounded-lg text-gray-300">
                  Notifications
                </button>
              </div>
              {/* Main Edit Section */}
              <div className={`flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-base-200'} rounded-lg shadow-lg p-6`}>
                <h2 className="text-xl font-semibold text-purple-400 mb-6">
                  Basic Information
                </h2>
                {isLoading == false ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <label className="block mb-1 text-gray-400">Name</label>
                      <input
                        type="text"
                        {...register("firstName")}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    {/* Last Name */}
                    <div>
                      <label className="block mb-1 text-gray-400">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register("lastName")}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-400">Email</label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-400">Age</label>
                      <input
                        type="number"
                        {...register("age")}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-gray-400">Role</label>
                      <input
                        type="text"
                        {...register("role")}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-semibold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  "loading"
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-base-100'}`}>
          <motion.div
            className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}
