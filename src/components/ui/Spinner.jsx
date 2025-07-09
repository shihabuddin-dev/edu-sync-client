import React from "react";
import { PiStudentFill } from "react-icons/pi";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Animated ring */}
        <svg
          className="animate-spin absolute inset-0"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-20"
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="8"
          />
          <path
            d="M60 32c0-15.464-12.536-28-28-28"
            stroke="url(#spinner-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="spinner-gradient" x1="32" y1="4" x2="60" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D51F63" />
              <stop offset="1" stopColor="#E86A92" />
            </linearGradient>
          </defs>
        </svg>
        {/* Education icon in the center */}
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-3xl md:text-4xl drop-shadow-lg">
          <PiStudentFill />
        </span>
      </div>
    </div>
  );
};

export default Spinner;
