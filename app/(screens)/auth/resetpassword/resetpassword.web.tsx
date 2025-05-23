"use client";

import React, { useState, useEffect, Suspense } from "react";
import { authClient } from "../../../lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordWebInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }
    
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid reset token");
      return;
    }

    setStatus("loading");

    try {
      await authClient.resetPassword({
        newPassword: password,
        token,
      }, {
        onSuccess: () => {
          setStatus("success");
          // Redirect to login page after 2 seconds
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        },
        onError: (ctx) => {
          setStatus("error");
          setErrorMessage(ctx.error?.message || "Failed to reset password. Please try again.");
        }
      });
    } catch{
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
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
      />

      {/* Title */}
      <h1
        className="absolute z-30 font-bold text-[#FFD8B9]"
        style={{
          top: "50%",
          left: "28%",
          transform: "translateX(-50%)",
          fontSize: "6vw",
        }}
      >
        RESET PASSWORD
      </h1>

      {/* Left Section */}
      <div className="flex-1 relative flex items-center justify-center bg-blue-400 z-0" />

      {/* Right Section */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#576EB6] relative z-20 w-[50%] ml-70">
        {/* Register Form */}
        <div
          className="w-full max-w-sm p-4 rounded-lg shadow-lg bg-white z-30 relative"
          style={{ transform: "translateX(-50px)" }}
        >
          <h1 className="text-gray-600 font-bold mb-6">
            Enter your new password
          </h1>
          
          {status === "success" ? (
            <div className="text-green-600 mb-4">
              Password reset successful! Redirecting to login...
            </div>
          ) : (
            /* Manual Registration Form */
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {status === "error" && (
                <div className="text-red-600 mb-4">{errorMessage}</div>
              )}
              
              <button
                type="submit"
                disabled={status === "loading" || !token}
                className={`w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition ${
                  (status === "loading" || !token) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {status === "loading" ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ResetPasswordWeb = () => (
  <Suspense>
    <ResetPasswordWebInner />
  </Suspense>
);

export default ResetPasswordWeb;
