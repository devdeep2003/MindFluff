import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
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
import CallButton from "../components/CallButton";
import {toast} from 'react-hot-toast'

const Chatpage = () => {
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const { id: targetClientid } = useParams();

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

  // Fetch Stream token once user is available
  const { data: token } = useQuery({
    queryKey: ["streamtoken"],
    queryFn: getStreamToken,
    enabled: !!me?.message._id,
  });

  useEffect(() => {
    const initChat = async () => {
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: me.message._id,
            name: me.message.username,
            image: me.message.profileImage,
          },
          token
        );

        const channelId = [me.message._id, targetClientid].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [me.message._id, targetClientid],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("💥 Error initializing chat client:", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();
    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [STREAM_API_KEY, token, me, targetClientid]);

  const handleVideoCall = () =>{
         if(channel){
          const callUri = `${window.location.origin}/call/${channel.id}`;
          channel.sendMessage({
            text : `I'm calling you...Let's talk!...Join me here : ${callUri}`
          })

          toast.success('Call Invitation sent')
         }
  }

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
              {/* Header */}
              <div className="border-b border-gray-700 bg-green-400/20 px-3 sm:px-5 py-3">
                <div className="flex justify-between items-center">
                  <ChannelHeader title="" />
                  <CallButton handleVideoCall={handleVideoCall} />
                  <div className="bg-green-500/30 px-4 py-2 rounded-full font-medium text-white">
                    This is your Personal Space. Chat freely here 
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto bg-[#0A0A0A]">
                <MessageList
                  TypingIndicator={() => (
                    <div className="text-green-400 text-sm p-2">Typing...</div>
                  )}
                />
              </div>

              {/* Input Bar */}
              <div
                className="
                  bg-[#111111] border-t border-gray-700
                  px-3 sm:px-5 py-3
                "
              >
                <MessageInput
                  focus
                  placeholder="Type your message..."
                  className="bg-[#1A1A1A] text-white rounded-xl"
                />
              </div>
            </Window>

            {/* Thread (hidden on mobile until opened) */}
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default Chatpage;
