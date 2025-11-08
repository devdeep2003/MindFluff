import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { toast } from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import { axiosInstance } from "../lib/axios";
import { getStreamToken } from "../lib/api";

const CallPage = () => {
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const { id: callId } = useParams();
  const navigate = useNavigate();

  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  // Fetch logged-in user
  const { data: me, isLoading: userLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
  });

  // Fetch Stream token once user data is available
  const { data: token } = useQuery({
    queryKey: ["streamtoken"],
    queryFn: getStreamToken,
    enabled: !!me?.message?._id,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!token || !me?.message?._id || !callId) return;

      try {
        const user = {
          id: me.message._id,
          name: me.message.username,
          image: me.message.profileImage,
        };

        const client = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token,
        });

        const callInstance = client.call("default", callId);
        await callInstance.join({ create: true });

        setVideoClient(client);
        setCall(callInstance);

        toast.success("🎥 Video call started!");
      } catch (error) {
        console.error("❌ Call init error:", error);
        toast.error("Failed to start the call");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [token, me?.message?._id, callId]);

  if (isConnecting || userLoading || !call) return <ChatLoader />;

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100">
      <div className="w-full h-full max-w-6xl rounded-2xl shadow-lg overflow-hidden border border-gray-200 bg-white">
        {videoClient && call ? (
          <StreamVideo client={videoClient}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Could not initiate the call. Try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  // Redirect when call is ended
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Top header */}
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            🟢 Live Video Call
          </h2>
          <p className="text-sm text-gray-500">Connected securely</p>
        </div>

        {/* Video Layout */}
        <div className="flex-grow bg-gray-100">
          <SpeakerLayout />
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
};

export default CallPage;
