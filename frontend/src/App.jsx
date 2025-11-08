import React from "react";
import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import { axiosInstance } from "./lib/axios.js";
import { useQuery } from "@tanstack/react-query";
import Notification from "./pages/Notification.jsx";
import Chatpage from "./pages/Chatpage.jsx";
import Callpage from "./pages/Callpage.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import FluffyBot from "./pages/FluffyBot.jsx";
import CommunityChat from "./pages/CommunityChat.jsx";

const App = () => {
  const {
    data: authUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const data = await axiosInstance.get("/auth/me");
      return data.data;
    },
  });

  if (isLoading) return <p>Loading current user...</p>;
  if (error) return <p>Error Fetching current user...</p>;

  const isUserLoggedIn = authUser?.success === true;

  return (
    <Routes>
      <Route
        path="/login"
        element={!isUserLoggedIn ? <Login /> : <Navigate to="/" />}
      />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<DashboardLayout />}>
        <Route
          path="/"
          element={isUserLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/call/:id"
          element={isUserLoggedIn ? <Callpage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat/:id"
          element={isUserLoggedIn ? <Chatpage /> : <Navigate to="/login" />}
        />
        <Route
          path="/notification"
          element={isUserLoggedIn ? <Notification /> : <Navigate to="/login" />}
        />
        <Route
          path="/chatbot"
          element={isUserLoggedIn ? <FluffyBot /> : <Navigate to="/login" />}
        />
        <Route
          path="/chatcommunity"
          element={
            isUserLoggedIn ? <CommunityChat /> : <Navigate to="/login" />
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
