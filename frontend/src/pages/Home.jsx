import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFriends,
  getOutgoingFriendsRequests,
  getRecommendations,
  sendFriendRequest,
} from "../lib/api";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";

const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [outgoingRequestIDs, setOutgoingRequestIDs] = useState(new Set());

  // --- Fetch Friends ---
  const {
    data: friends,
    isLoading: isFriendsLoading,
    error: errorFriends,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  // --- Fetch Recommendations ---
  const {
    data: recommendations,
    isLoading: isRecommendationsLoading,
    error: errorRecommendations,
  } = useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
    staleTime: 1000 * 60 * 5,
  });

  // --- Fetch Outgoing Friend Requests ---
  const { data: outgoingFriendsRequests } = useQuery({
    queryKey: ["outgoingFriendsRequests"],
    queryFn: getOutgoingFriendsRequests,
    staleTime: 1000 * 60 * 5,
  });

  // --- Send Friend Request ---
  const { mutate: sendFriendReq, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (_, userId) => {
      toast.success("Friend request sent!");

      // ✅ Instantly update local UI
      setOutgoingRequestIDs((prev) => {
        const updated = new Set(prev);
        updated.add(userId);
        return updated;
      });

      // ✅ Invalidate so data stays consistent
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendsRequests"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send request");
    },
  });

  // --- Track Outgoing Request IDs ---
  useEffect(() => {
    if (outgoingFriendsRequests?.length > 0) {
      const outgoingIDs = new Set(
        outgoingFriendsRequests.map((req) => req.receiverId)
      );
      setOutgoingRequestIDs(outgoingIDs);
    } else {
      setOutgoingRequestIDs(new Set());
    }
  }, [outgoingFriendsRequests]);

  // --- Loading & Error States ---
  if (isFriendsLoading || isRecommendationsLoading)
    return (
      <div className="text-gray-300 text-center py-10 text-lg ">
        Loading Home...
        <ChatLoader />
      </div>
    );

  if (errorFriends || errorRecommendations)
    return (
      <div className="text-red-400 text-center py-10 text-lg">
        Failed to load data 😢
      </div>
    );

  // --- UI ---
  return (
    <div className="p-6 pt-0 text-gray-100">
      {/* Friends Section */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-teal-400">Your Friends</h1>
        <button
          onClick={() => navigate("/notification")}
          className="bg-gray-800 hover:bg-teal-600 text-gray-200 hover:text-white px-4 py-2 rounded-lg transition-all"
        >
          View Friend Requests
        </button>
      </div>

      {friends?.friends?.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {friends.friends.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded-xl shadow-sm hover:bg-gray-700 transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={friend.profileImage || "/default-avatar.png"}
                  alt={friend.username}
                  className="w-12 h-12 rounded-full object-cover border border-teal-500"
                />
                <div>
                  <h3 className="text-lg font-semibold">{friend.username}</h3>
                  <p className="text-sm text-gray-400">{friend.college}</p>
                </div>
              </div>

              <Link
                to={`/chat/${friend._id}`}
                className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-lg text-sm transition-all"
              >
                Message
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mb-8">You have no friends yet 😅</p>
      )}

      {/* Recommendations Section */}
      <h2 className="text-2xl font-bold text-teal-300 mb-3">
        People You May Know
      </h2>

      {recommendations?.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((user) => {
            const alreadyRequested = outgoingRequestIDs.has(user._id);

            return (
              <div
                key={user._id}
                className="flex items-center justify-between bg-gray-800 p-4 rounded-xl shadow-sm hover:bg-gray-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.profileImage || "/default-avatar.png"}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border border-teal-500"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{user.username}</h3>
                    <p className="text-sm text-gray-400">{user.college}</p>
                  </div>
                </div>

                <button
                  onClick={() => sendFriendReq(user._id)}
                  disabled={alreadyRequested || isPending}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    alreadyRequested
                      ? "bg-blue-500/30 text-blue-300 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600 text-white hover:scale-105"
                  }`}
                >
                  {alreadyRequested
                    ? "Request Sent"
                    : isPending
                    ? "Sending..."
                    : "Send Friend Request"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400">No recommendations right now.</p>
      )}
    </div>
  );
};

export default Home;
