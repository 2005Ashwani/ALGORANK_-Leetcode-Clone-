import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import { useSelector } from "react-redux";

export default function SignAsAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const { theme } = useSelector((state) => state.theme);

  // Destructure reset to clear the form later
  const { register, handleSubmit, reset } = useForm();

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await axiosClient.post(`/auth/admin/register`, data);
      console.log("Response:", res.data);
      alert("Admin Registered Successfully!");
      reset(); // Clears all form fields after successful submission
    } catch (error) {
      console.log(error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-theme={theme} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300 text-base-content p-4">
      {isloading === true ? (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-purple-300 animate-pulse">
            Registering Admin...
          </p>
        </div>
      ) : (
        <div className="card bg-base-100 p-8 rounded-xl shadow-xl max-w-sm w-full border border-base-300 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
            Admin Sign Up
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-control">
              <input
                {...register("firstName")}
                type="text"
                placeholder="Enter First Name"
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
              />
            </div>

            <div className="form-control">
              <input
                {...register("lastName")}
                type="text"
                placeholder="Enter Last Name"
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
              />
            </div>

            <div className="form-control">
              <input
                {...register("email")}
                type="email"
                placeholder="Enter Email"
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
              />
            </div>

            <div className="form-control">
              <input
                {...register("age")}
                type="number"
                placeholder="Enter Age"
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
              />
            </div>

            <div className="form-control">
              <input
                {...register("role")}
                type="text"
                placeholder="Enter Role"
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
              />
            </div>

            <div className="form-control relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="input input-bordered w-full pr-10 focus:input-primary transition-all duration-200"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
