"use client";

import React, { useState } from "react";
import { authClient } from "../../../lib/auth-client";

const ForgotPasswordMobile = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await authClient.forgetPassword({ 
        email,
        redirectTo: "/auth/resetpassword",
      }, {
        onSuccess: () => {
          setStatus("success");
        },
        onError: (ctx) => {
          setStatus("error");
          setErrorMessage(ctx.error?.message || "Something went wrong. Please try again.");
        }
      });
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send reset link. Please try again later.");
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
              FORGOT PASSWORD
            </h1>

            {/* Form Heading */}
            <h2 className="text-basefont-semibold text-[#FAD6A5] mt-8 ml-2">
              Enter your email to reset your password
            </h2>

            {status === "success" ? (
              <div className="text-green-500 mb-4 p-2">
                Reset link sent! Please check your email.
              </div>
            ) : (
              <form className="space-y-4 mt-2 ml-2 mr-2" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-70 px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {status === "error" && (
                  <div className="text-red-600 mb-4">{errorMessage}</div>
                )}
              
                <button
                  type="submit"
                  className="w-70 py-3 bg-[#837EFF] text-[#FAD6A5] font-bold rounded-full hover:bg-[#7C67E8] transition"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordMobile;