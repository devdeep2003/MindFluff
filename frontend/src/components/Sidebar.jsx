import React from "react";
import { Home, Users, Bell, Circle , BotMessageSquare, Users2} from "lucide-react"; // icons
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

const Sidebar = () => {
  const navigate = useNavigate();

  const {data : authUser} = useQuery({
    queryKey: ["authUser"],
    queryFn : async () => {
      const data = await axiosInstance.get("/auth/me");
      return data.data;
    },
  enabled:false
  })

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, route: "/" },
    {name : "Community Chat" , icon : <Users2 size={20}/> , route : "/chatcommunity"},
    { name: "Notifications", icon: <Bell size={20} />, route: "/notification" },
    { name: "FluffyBot" , icon: <BotMessageSquare size={20}/> , route: "/chatbot"}
  ]; 

  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col justify-between shadow-xl border-r border-gray-800">
      {/* Top Section - Logo */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-teal-400 text-center flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
          MindFluff
        </h1>
      </div>

      {/* Middle Section - Navigation */}
      <nav className="flex flex-col px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.route)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800 hover:bg-teal-600 transition-all text-gray-200 hover:text-white font-medium hover:cursor-pointer "
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section - User Info */}
      <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-850">
        <div className="flex justify-center items-center gap-2">
          <img src={authUser?.message?.profileImage} alt="profile" className="w-10 h-10 rounded-full object-cover" />
          <p className="text-gray-200 font-semibold">{authUser?.message?.username}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
