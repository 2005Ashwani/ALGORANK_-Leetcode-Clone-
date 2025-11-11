import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

//schema validation for Signup form
const SignUpSchema = z.object({
  firstName: z.string().min(3, "Name should contain 3 characters").max(20),
  lastName: z.string().min(3, "Last name should contain 3 characters").max(20),
  age: z.coerce.number().min(1, "Age must be greater than 0").max(120, "Invalid age"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password should contain 8 characters").max(25),
});


function SignPage() {
  const [showPassword, setShowPassword] = useState(false); // Inititally the password had not to show

  const dispatch = useDispatch(); // Yaha sai data vajana ka liya
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignUpSchema) });

  // USER KUCH VI KAR SAKATA HAI
  // AGAR SIGNUP PER AYA OR AUTHONTICATED HAI TOH HOME PER CHALA JAYE
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]); //isAuthenticated OR NAVIGATE CHANGE HOTA HAI TABHI USEEFFECT CHALEGA

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5 ">
      <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent transition-all duration-300 hover:from-indigo-500 hover:to-purple-500">
        AlgoRank
      </span>
      <form
        onSubmit={handleSubmit(
          (data) => dispatch(registerUser(data))
          // Kya yahi sai data backend main data vajana sahi hoga
        )}
        className="flex flex-col gap-6 "
      >
        <input
          type="text"
          {...register("firstName")}
          placeholder="Enter First Name"
          className="input input-primary w-[25vw]"
        />


        {errors.firstName && (
          // <span className="bg-amber-400">{errors.firstName.message}</span>

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
            <span>{errors.firstName.message}</span>
          </div>
        )}
        
        <input
          type="text"
          {...register("lastName")}
          placeholder="Enter Last Name"
          className="input input-primary w-[25vw]"
        />


        {errors.lastName && (
         

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
            <span>{errors.lastName.message}</span>
          </div>
        )}
     
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



      <input
          type="number"
          {...register("age")}
          placeholder="Enter Age"
          className="input input-primary w-[25vw]"
        />


        {errors.firstName && (
         

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
            <span>{errors.age.message}</span>
          </div>
        )}



        <div className="relative">
          {" "}
          {/* Add a relative parent for absolute positioning of the button */}
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })} // Example validation
            placeholder="********"
            className="input input-primary w-[25vw] pr-10" // Add padding to the right for the button
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-lg" // Adjusted hover size for better control
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.964 9.964 0 012.46-4.093m3.337-2.419A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.964 9.964 0 01-4.093 5.209M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                />
              </svg>
            )}
          </button>
          {/* Error Indication  */}
          {errors.password && (
            <div className="flex items-center gap-2 bg-amber-400 text-black p-3 rounded-md mt-2">
              {" "}
              {/* Added mt-2 for spacing */}
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
          )}
        </div>

        <div className="form-control mt-8 flex justify-center">
          <button
            type="submit"
            className={`btn btn-primary w-[7vw] ${loading ? "loading" : ""}`}
            // {/* true then submit button not work  */}
            disabled={loading}
            // {/* jaisa app click  kar raha ho backend main loading true ho jayaga */}
          >
            Submit
          </button>
        </div>
      </form>

      <div>
        Already have an account?
        <button
          onClick={() => navigate("/login")}
          className="text-[#605DFF] underline hover:cursor-pointer"
        >
          login
        </button>
      </div>
    </div>
  );
}

export default SignPage;
