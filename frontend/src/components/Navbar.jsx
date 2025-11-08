import React from "react";
import { LogOut, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Fetch current logged-in user
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
  });

  // ✅ Logout mutation
  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/logout");
      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey : ["authUser"]})
      await navigate("/login");
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Logout failed");
    },
  });

  const userData = authUser?.message; // or .user if you rename backend field

  return (
    <div className="w-full bg-gray-900 text-gray-100 shadow-md border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      {/* Left - App Name */}
      <h1
        className="text-2xl font-bold text-teal-400 cursor-pointer flex items-center gap-2"
        onClick={() => navigate("/")}
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
       MindFluff
      </h1>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        {/* Profile Button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 bg-gray-800 hover:bg-blue-200 px-4 py-2 rounded-xl text-gray-200 hover:text-black transition-all cursor-pointer"
        >
          {/* ✅ Fixed: use <img /> instead of <Image /> */}
          {userData?.profileImage ? (
            <img
              src={userData.profileImage}
              alt="profile"
              className="w-6 h-6 rounded-full object-cover "
            />
          ) : (
            <UserCircle2 size={20} />
          )}
          <span className="hidden sm:inline">
            {userData?.username || "User"}
          </span>
        </button>

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          disabled={isPending}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            isPending
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600 text-white"
          }`}
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">
            {isPending ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
