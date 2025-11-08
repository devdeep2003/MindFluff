import React, { useState } from "react";
import Lottie from "lottie-react";
import HomePageLottie from "../assets/counselling.json";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { signUp } from "../lib/api";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const {mutate , isPending , error} = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      toast.success("Signup successful!");
      queryClient.invalidateQueries({queryKey : ["authUser"]})
      navigate("/login")
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed!");
    },
  });

  const handleForm = (e) => {
    e.preventDefault();
     mutate({ username, email, college, password });
  };

  return (
   <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-gray-100">
  {/* Left Animation Section */}
  <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-800 via-teal-800 to-blue-900 p-6 ">
    <h1 className="text-4xl font-bold text-teal-300 mb-6 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="29" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
      MindFluff</h1>

    <div className="w-96 h-96 bg-gray-700 rounded-full shadow-xl overflow-hidden">
      <Lottie animationData={HomePageLottie} loop={true} />
    </div>
  </div>

      {/* Right Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6">
        <div className="card w-full max-w-md shadow-xl bg-gray-800 rounded-2xl">
          <div className="card-body">
            <h2 className="text-3xl font-bold text-teal-400 text-center mb-2">
              Sign Up
            </h2>
            <p className="text-center text-gray-400 mb-6">
              Prioritize your mental well-being. Join our student community today.
            </p>

            <form className="space-y-4" onSubmit={handleForm}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-200 mb-1">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input input-bordered w-full bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-25"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-200 mb-1">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-25"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-200 mb-1">College</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your college"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="input input-bordered w-full bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-25"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-200 mb-1">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-teal-400 focus:ring focus:ring-teal-400 focus:ring-opacity-25"
                  required
                />
              </div>

              <div className="form-control mt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`btn w-full text-white font-semibold shadow-md transition-all rounded-2xl ${
                    isPending
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600"
                  }`}
                >
                  {isPending ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </form>

            <p className="text-center text-gray-400 mt-4 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-teal-400" onClick={()=>navigate("/login")}>
                Login
              </a>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
};

export default SignUp;
