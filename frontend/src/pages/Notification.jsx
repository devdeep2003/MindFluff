import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  acceptFriendRequest,
  getIncomingFriendRequests,
} from "../lib/api";
import { toast } from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";

const Notification = () => {
  const queryClient = useQueryClient();

  const {
    data: friendRequests,
    isLoading: isFriendRequestsLoading,
  } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getIncomingFriendRequests,
  });

  const {
    mutate: acceptFriendReq,
    isPending: isAcceptFriendRequestPending,
  } = useMutation({
    mutationKey: ["acceptFriendRequest"],
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const requests = friendRequests;

  if (isFriendRequestsLoading)
    return (
      <div className="text-gray-300 text-center py-10 text-lg">
        Loading Notifications...
        <ChatLoader/>
      </div>
    );

  return (
    <div className="p-6 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">
        Friend Requests
      </h1>

      <div className="mb-4 text-gray-400">
        Total Requests:{" "}
        <span className="text-teal-300 font-semibold">
          {requests?.length || 0}
        </span>
      </div>

      {requests?.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded-xl shadow-sm hover:bg-gray-700 transition-all"
            >
              {/* Left side: Avatar + details */}
              <div className="flex items-center gap-4">
                <img
                  src={req.sender.profileImage || "/default-avatar.png"}
                  alt={req.sender.username}
                  className="w-12 h-12 rounded-full object-cover border border-teal-500"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {req.sender.username}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {req.sender.college || "Unknown College"}
                  </p>
                </div>
              </div>

              {/* Accept Button */}
              <button
                onClick={() => acceptFriendReq(req.sender._id)}
                disabled={isAcceptFriendRequestPending}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:cursor-pointer ${
                  isAcceptFriendRequestPending
                    ? "bg-blue-500/30 text-blue-300 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600 text-white hover:scale-105"
                }`}
              >
                {isAcceptFriendRequestPending ? "Accepting..." : "Accept"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">
          No pending friend requests 🎉
        </p>
      )}
    </div>
  );
};

export default Notification;
