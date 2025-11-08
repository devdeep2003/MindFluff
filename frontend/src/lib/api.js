import { axiosInstance } from "./axios";

export const signUp = async (userData) => {
  const res = await axiosInstance.post("/auth/signup", userData);
  return res.data;
};

export const login = async (userData) => {
  const res = await axiosInstance.post("/auth/login", userData);
  return res.data;
};

export const getFriends = async () => {
  const res = await axiosInstance.get("/users/myfriends");
  return res.data;
};

export const getRecommendations = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const getOutgoingFriendsRequests = async () => {
  const data = await axiosInstance.get("/users/friend-requests");
  return data.data;
};

export const sendFriendRequest = async (userId) =>{
  const res = await axiosInstance.post(`/users/friend-request/${userId}`)
  return res.data
}

export const getIncomingFriendRequests = async () => {
  const res = await axiosInstance.get("/users/friend-requests");
  return res.data;
}

export const acceptFriendRequest = async (userId) =>{
  const res = await axiosInstance.put(`/users/friend-request/${userId}/accept`)
  return res.data;
}

export const getStreamToken = async () => {
  try {
    const res = await axiosInstance.get("/chat/token");
    return res.data?.token;
  } catch (err) {
    console.error("❌ Error fetching stream token:", err);
    return null;
  }
};
