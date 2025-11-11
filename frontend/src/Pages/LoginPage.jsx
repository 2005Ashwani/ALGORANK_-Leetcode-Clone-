import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

//schema validation for Login form
const LoginSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password should contain 8 character").max(25),
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch(); // Yaha sai data vajana ka liya
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(LoginSchema) });

  // USER KUCH VI KAR SAKATA HAI
  // AGAR SIGNUP PER AYA OR AUTHONTICATED HAI TOH HOME PER CHALA JAYE
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]); //isAuthenticated OR NAVIGATE CHANGE HOTA HAI TABHI USEEFFECT CHALEGA

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent transition-all duration-300 hover:from-indigo-500 hover:to-purple-500">
        AlgoRank
      </span>
      <form
        onSubmit={handleSubmit((data) => dispatch(loginUser(data)))}
        className="flex flex-col gap-6"
      >
        <input
          type="text"
          {...register("email")}
          placeholder="Enter Email"
          className="input input-primary w-[25vw]"
        />

        {errors.email && (
          <div className="flex items-center gap-2 bg-amber-400 text-black p-3 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
         1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
         0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{errors.email.message}</span>
          </div>
        )}
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="********"
            className="input input-primary w-[25vw]"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* 
        {errors.password && (
            <div className="flex items-center gap-2 bg-amber-400 text-black p-3 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
         1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
         0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{errors.password.message}</span>
            </div>
          )} */}

        <button className="btn btn-primary w-[7vw] flex self-end">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
