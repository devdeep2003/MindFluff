import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { getStreamToken } from "../lib/api";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { StreamChat } from "stream-chat";
import ChatLoader from "../components/ChatLoader";
import { toast } from "react-hot-toast";
import CallButton from "../components/CallButton";

const CommunityChat = () => {
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user
  const { data: me, isLoading: userLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
  });

  // Fetch Stream token
  const { data: token } = useQuery({
    queryKey: ["streamtoken"],
    queryFn: getStreamToken,
    enabled: !!me && !!me.message?._id,
  });

  useEffect(() => {
    const initCommunityChat = async () => {
      try {
        if (!me?.message?._id || !token) {
          console.warn("Waiting for user/token...");
          return;
        }

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: me.message._id,
            name: me.message.username,
            image: me.message.profileImage,
          },
          token
        );

        // ✅ Use 'livestream' for open-access community channels
        const communityChannel = client.channel("livestream", "community-lounge", {
          name: "Community Lounge 💬",
        });

        await communityChannel.watch();

        setChatClient(client);
        setChannel(communityChannel);
      } catch (error) {
        console.error("💥 Error initializing community chat:", error);
        toast.error("Failed to join community chat");
      } finally {
        setLoading(false);
      }
    };

    initCommunityChat();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [STREAM_API_KEY, token, me]);



  if (loading || userLoading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div
      className="
        flex flex-col h-screen w-full
        bg-[#000000] text-white overflow-hidden
        px-0 sm:px-2 md:px-4
      "
    >
      <div
        className="
          flex flex-col w-full max-w-[1200px] mx-auto
          h-full rounded-none sm:rounded-2xl
          overflow-hidden
          border border-black sm:border-black
          shadow-lg
          transition-all duration-300
        "
      >
        <Chat client={chatClient} theme="str-chat__theme-dark">
          <Channel channel={channel}>
            <Window>
              <div className="border-b border-gray-700 bg-green-400/20 px-3 sm:px-5 py-3">
                <div className="flex justify-between items-center">
                  <ChannelHeader title="Community Lounge" />
                  <div className="bg-green-500/30 px-4 py-2 rounded-full font-medium text-white">
                    Chat freely with your own people
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-[#0A0A0A]">
                <MessageList
                  TypingIndicator={() => (
                    <div className="text-green-400 text-sm p-2">Someone is typing...</div>
                  )}
                />
              </div>

              <div
                className="
                  bg-[#111111] border-t border-gray-700
                  px-3 sm:px-5 py-3
                "
              >
                <MessageInput
                  focus
                  placeholder="Say something to the community..."
                  className="bg-[#1A1A1A] text-white rounded-xl"
                />
              </div>
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default CommunityChat;
