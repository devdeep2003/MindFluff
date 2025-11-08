import React from "react";
import { Video } from "lucide-react";

const CallButton = ({ handleVideoCall }) => {
  return (
    <button
      onClick={handleVideoCall}
      className="
        flex items-center justify-center
        w-12 h-12 sm:w-14 sm:h-14
        rounded-full
        bg-green-300/20
        border border-green-300/40
        hover:bg-green-300/30 hover:scale-105
        transition-all duration-300
        shadow-md hover:shadow-green-300/30
        hover:cursor-pointer
      "
    >
      <Video
        className="text-green-300 w-6 h-6 sm:w-7 sm:h-7"
        strokeWidth={2.5}
      />
    </button>
  );
};

export default CallButton;
