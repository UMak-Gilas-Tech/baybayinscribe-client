"use client";
import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";

const RegisterMobile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await authClient.signUp.email({ email, password, name: "New user" });
      if (response?.error) {
        setError(response.error.message || "Registration failed");
      } else {
        router.push("/auth/userinfo");
      }
    } catch {
      setError("An unexpected error occurred");
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
              CREATE ACCOUNT
            </h1>

            {/* Form Heading */}
            <h2 className="text-basefont-semibold text-[#FAD6A5] mt-8 ml-2">
              Email Address
            </h2>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-2 ml-2 mr-2">
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
              <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
                Password
              </h2>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className="w-70 px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                    style={{
                      right: "30px",
                    }}
                  >
                    {showPassword ? (
                      <EyeClosed className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
                Confirm Password
              </h2>
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    placeholder="Confirm your password"
                    className="w-70 px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                    style={{
                      right: "30px",
                    }}
                  >
                    {showConfirmPassword ? (
                      <EyeClosed className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-between text-xs text-black">
                <span>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline text-[#00C8FF] hover:text-[#00eeff]">
                    Login here
                  </Link>
                </span>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-[#FAD6A5]">
                  By clicking continue, you agree to our Terms and Privacy Policy.
                </p>
              </div>
              
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-[#837EFF] text-[#FAD6A5] font-bold rounded-full hover:bg-[#7C67E8] transition"
              >
                Continue
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-black" />
              <hr className="flex-grow border-black" />
            </div>

            {/* Social Login */}
            <div className="flex justify-center gap-12">
              <button className="w-12 h-12 bg-transparent flex items-center justify-center rounded-md shadow-md">
                <Image
                  src="/images/fb.icon.png"
                  alt="Facebook Icon"
                  width={48}
                  height={48}
                />
              </button>
              <button className="flex items-center justify-center">
                <Image
                  src="/images/google.icon.png"
                  alt="Google Icon"
                  width={48}
                  height={48}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterMobile;