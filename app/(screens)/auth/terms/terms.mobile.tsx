"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const TermsServicesMobile = () => {
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
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center relative overflow-y-auto"
      style={{
        backgroundImage: "url('/images/bg.phone.login.png')",
      }}
    >

      {/* Wave Design */}
      <div
        className="fixed bottom-0 left-0 right-0 z-10 bg-cover bg-center"
        style={{
          width: "130%",
          minHeight: "90vh",
          backgroundImage: "url('/images/vector.bg.png')",
          backgroundSize: "100% 115%",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center w-full h-full pt-40 pb-16">
        <div className="w-full max-w-xs md:max-w-sm px-4">
          {/* Title */}
          <h1
            className="text-2xl md:text-4xl lg:text-4xl text-[#FAD6A5] text-center mt-16 mb-8 font-bold whitespace-nowrap"
          >
            Terms and Agreement
          </h1>

          {/* Instructions Text */}
          <p className="text-[#FAD6A5] text-center mb-6 text-sm md:text-lg lg:text-base">
            Please check the box below:
          </p>

          {/* Checkboxes */}
          <div className="w-full flex flex-col items-start space-y-3 mb-6">
            <div className="flex items-center">
              <input type="checkbox"
                id="terms"
                checked={agree}
                onChange={handleCheckboxChange}
                className="mr-2 accent-[#837EFF]" required />

              <label htmlFor="terms" className="text-sm md:text-base lg:text-sm text-[#FAD6A5]">
                I agree to the Terms of Service and Privacy Policy.
              </label>

            </div>

            <div className="flex items-center">
              <input type="checkbox" id="notifications"
                checked={wantsNotifications}
                onChange={handleNotificationChange}
                className="mr-2 accent-[#837EFF]" />

              <label htmlFor="notifications" className="text-sm md:text-base lg:text-sm text-[#FAD6A5]">
                I want to be notified of upcoming offers, events, and latest news.
              </label>

            </div>
          </div>

          {/* Finish Registration Button */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="button"
            disabled={isSubmitting || isLoading}
            className={`w-full py-3 mt-8 bg-[#837EFF] text-white text-base md:text-xl lg:text-base font-semibold rounded-full hover:bg-[#7C67E8] transition cursor-pointer relative ${
              isSubmitting || isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
          >
            {isLoading ? <LoadingSpinner loadingText="Finishing..." /> : "Finish Registration"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsServicesMobile;