import { Bot } from "lucide-react";
import React, { useState } from "react";
import ChatForm from "../components/ChatForm";
import ChatMessage from "../components/ChatMessage";
import { chatbotPrompt } from "../lib/chatbotPrompt";

const FluffyBot = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      message: chatbotPrompt,
    },
  ]);

  const updateHistory = (text) => {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.message !== "Hold on a sec..."),
      { role: "bot", message: text },
    ]);
  };

  const generateBotResponse = async (history) => {
    const formattedHistory = history.map((msg) => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.message }],
    }));

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formattedHistory }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Something went wrong");

      // ✅ Gemini-compatible parsing
      const apiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.candidates?.[0]?.content?.parts?.[0]?.data?.text ||
        "Sorry, I didn’t quite catch that 😅";

      updateHistory(apiResponse);
    } catch (error) {
      console.error("Bot error:", error);
      updateHistory("Oops! Something went wrong 😔");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#0f172a] text-white rounded-2xl shadow-lg overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="bg-[#1e293b] px-6 py-4 flex items-center border-b border-gray-700">
        <Bot className="text-green-400 w-6 h-6 mr-2" />
        <h2 className="text-lg font-semibold">FluffyBot</h2>
      </div>

      {/* Chat Body */}
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 self-start bg-[#1e293b] p-3 rounded-2xl max-w-[80%]">
          <Bot className="w-6 h-6 bg-blue-500 rounded-full p-1" />
          <p>Hey There 👋</p>
        </div>

        <div className="flex items-center gap-2 self-start bg-[#1e293b] p-3 rounded-2xl max-w-[80%]">
          <Bot className="w-6 h-6 bg-blue-500 rounded-full p-1" />
          <p>Hello! How can I assist you today?</p>
        </div>

        {/* Dynamic chat */}
        {chatHistory
          .filter((chat) => !chat.hideInChat)
          .map((chat, i) => (
            <ChatMessage key={i} chat={chat} />
          ))}
      </div>

      {/* Input Form */}
      <ChatForm
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        generateBotResponse={generateBotResponse}
      />
    </div>
  );
};

export default FluffyBot;
