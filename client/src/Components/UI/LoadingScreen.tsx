import React from "react";

/** Full-screen loader shown while we verify the user session */
export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#202225] gap-4">
      {/* Spinner */}
      <svg
        className="w-12 h-12 animate-spin text-white"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l5-5-5-5v4A12 12 0 002 12h2z"
        />
      </svg>

      {/* Status text */}
      <p className="text-gray-300 text-lg tracking-wide">
        Checking your session&hellip;
      </p>
    </div>
  );
}
