import { Bot } from "lucide-react";
import React from "react";

const ChatMessage = ({ chat }) => {
  const isBot = chat.role === "bot";

  return (
    !chat.hideInChat && (
      <div
        className={`p-3 rounded-2xl max-w-[80%] shadow-sm flex gap-3 ${
          isBot
            ? "self-start bg-[#1e293b] text-gray-100"
            : "self-end bg-green-500 text-black"
        }`}
      >
        {isBot && (
          <div className="flex-shrink-0">
            <Bot className="w-8 h-8 bg-blue-500 border border-blue-500 rounded-full p-1" />
          </div>
        )}
        <p className="message-text leading-relaxed">{chat.message}</p>
      </div>
    )
  );
};

export default ChatMessage;
