import React, { useRef } from "react";
import { Send } from "lucide-react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    setChatHistory((prev) => [...prev, { role: "user", message: userMessage }]);

    setTimeout(() => {
      setChatHistory((prev) => [...prev, { role: "bot", message: "Hold on a sec..." }]);

      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          message: `Using the emotional and supportive context above, reply to this message: ${userMessage}`,
        },
      ]);
    }, 800);

    inputRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex items-center gap-2 p-4 bg-[#1e293b] border-t border-gray-700"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Express your feelings with your personalized chatbot"
        className="flex-1 bg-[#0f172a] text-gray-200 placeholder-gray-500 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-400 text-black p-2 rounded-xl transition"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatForm;
