"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { authClient } from "../../../lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordMobile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-end bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/bg.phone.login.png')",
      }}
    >
      {/* Wave Design */}
      <div
        className="absolute z-20 bg-cover bg-center"
        style={{
          width: "100%",
          minHeight: "100vh",
          bottom: "0",
          backgroundImage: "url('/images/vector.bg.png')",
          backgroundSize: "100%",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute z-20 bg-cover bg-center flex flex-col items-center justify-start"
          style={{
            width: "100%",
            height: "75vh",
            bottom: "0",
            backgroundImage: "url('/images/vector.bg.png')",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            paddingTop: "25vh",
          }}
        >
          {/* Content Container */}
          <div className="w-full max-w-xs md:max-w-sm">
            {/* Title */}
            <h1
              className="text-2xl md:text-4xl font-bold text-[#FAD6A5] text-center"
              style={{
                marginTop: "-30vh",
                marginLeft: "-50px",
              }}
            >
              ENTER NEW PASSWORD
            </h1>

            {status === "success" ? (
              <div className="text-green-500 mb-4 p-2 bg-white rounded">
                Password reset successful! Redirecting to login...
              </div>
            ) : (
              <>
                {/* Form Heading */}
                <h2 className="text-basefont-semibold text-[#FAD6A5] mt-8 ml-2">
                  New Password
                </h2>

                {/* Login Form */}
                <form className="space-y-4 mt-2 ml-2 mr-2" onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? (
                        <EyeClosed className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <h2 className="text-basefont-semibold text-[#FAD6A5] mt-2">
                    Confirm New Password
                  </h2>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showConfirmPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {status === "error" && (
                    <div className="text-red-600 p-2 mb-4">{errorMessage}</div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={status === "loading" || !token}
                    className={`w-full py-3 bg-[#837EFF] text-[#FAD6A5] font-bold rounded-full hover:bg-[#7C67E8] transition ${
                      (status === "loading" || !token) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {status === "loading" ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordMobile;