"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const TermsServicesWeb = () => {
  const [agree, setAgree] = useState(false);
  const [wantsNotifications, setWantsNotifications] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = () => {
    setAgree(!agree);
    setError("");
  };

  const handleNotificationChange = () => {
    setWantsNotifications(!wantsNotifications);
  };

  const handleSubmit = async () => {
    if (!agree) {
      setError("Please agree to the terms and conditions to proceed.");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      // Save the notification preference
      const response = await fetch("/api/user.information", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wantsNotifications,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to save notification preference:", data.error);
        // Continue anyway, don't block the user flow
      }

      router.push("/auth/login");
    } catch (err) {
      console.error("Error saving notification preference:", err);
      // Continue anyway, don't block the user flow
      router.push("/auth/login");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex relative overflow-hidden bg-blue-400 z-0">

      {/* Vector SVG Design */}
      <svg
        className="absolute top-0 right-0 left-60 w-full h-full z-20 pointer-events-none"
        viewBox="0 0 953 1117"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M467.668 1228.1C352.393 1249.77 233.277 1431.71 135.652 1303.79C31.3046 1167.06 
          -15.0714 872.264 4.30933 620.941C22.1086 390.126 147.975 293.858 226.551 125.041C308.566 
          -51.1645 349.268 -388.817 467.668 -374.563C586.833 -360.216 597.189 7.37001 682.118 179.887C768.217 
          354.783 942.591 374.012 957.745 620.941C972.904 867.966 847.771 1060.94 744.071 1189.41C661.837 1291.29 563.271 1210.13 467.668 1228.1Z"
          fill="#576EB6"
        />
      </svg>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-10"
        style={{
          backgroundImage: "url('/images/bgimage.login.png')",
          backgroundSize: "60%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
          minHeight: "600px",

        }}
      >

      </div>
      <h1 className="absolute z-20 text-4xl lg:text-5xl font-bold text-[#FFD8B9]" style={{
        top: '50%',
        left: '28%',
        transform: 'translateX(-50%)',
        fontSize: '4vw',
      }}>
        TERMS AND AGREEMENT
      </h1>

      {/* Left Section */}
      <div className="flex-1 relative flex items-center justify-center bg-blue-400 z-0">

      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#576EB6] relative z-20 w-[50%] ml-70">

        {/* Content Box */}
        <div className="w-full max-w-sm p-8 rounded-lg shadow-lg bg-white z-30 relative flex flex-col items-center"
          style={{
            transform: 'translateX(-35px)',
          }}>


          {/* Instructions Text */}
          <p className="text-[#585858] text-center mb-6">
            Please check the box below
          </p>

          {/* Checkboxes */}
          <div className="w-full flex flex-col items-start space-y-3 mb-6 px-4">
            <div className="flex items-center">
              <input type="checkbox"
                id="agree"
                checked={agree}
                onChange={handleCheckboxChange}
                className="mr-2 accent-[#837EFF]" required />
              <label htmlFor="agree" className="text-sm text-[#585858]">
                I agree to the Terms of Service and Privacy Policy.
              </label>

            </div>
            <div className="flex items-center">
              <input type="checkbox"
                id="notifications"
                checked={wantsNotifications}
                onChange={handleNotificationChange}
                className="mr-2 accent-[#837EFF]" />
              <label htmlFor="notifications" className="text-sm text-[#585858]">
                I want to be notified of upcoming offers, events, and latest news.
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Finish Registration Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className={`w-4/5 py-3 mb-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition cursor-pointer relative ${
              isSubmitting || isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? <LoadingSpinner loadingText="Finishing..." /> : "Finish Registration"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsServicesWeb;
