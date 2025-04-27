"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";
import { useRouter } from "next/navigation";


const LoginWeb = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();


    setLoginError(""); // reset error before attempt


    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      }, {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          setLoginError(ctx.error?.message || "This account does not exist.");
        },
      });
    } catch {
      setLoginError("Failed to sign in. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/api/auth/check.user.info",
      });
    } catch {
      setLoginError("Failed to sign in with Google. Please try again.");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "facebook",
        callbackURL: "/api/auth/check.user.info",
      });
    } catch {
      setLoginError("Failed to sign in with Facebook. Please try again.");
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
          354.783 942.591 374.012 957.745 620.941C972.904 867.966 847.771 1060.94 744.071 1189.41C661.837 1291.29
          563.271 1210.13 467.668 1228.1Z"
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
      ></div>


      {/* Whale Design */}
      <div className="absolute z-20" style={{
        width: "130vw",
        height: "30vh",
        left: "-32vw",
        top: "38vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",


      }}>
        <Image
          src="/images/butty.login.png"
          alt="Whale"
          width={600}
          height={100}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      <h1 className="absolute z-30 text-4xl lg:text-5xl font-bold text-[#FFD8B9]" style={{
        top: '50%',
        left: '28%',
        transform: 'translateX(-50%)',
        fontSize: '6vw',
      }}>
        BAYBAYINSCRIBE
      </h1>


      {/* Left Section */}
      <div className="flex-1 relative flex items-center justify-center bg-blue-400 z-0">
      </div>


      {/* Right Section */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#576EB6] relative z-20 w-[50%] ml-70">


        {/* Login Form */}
        <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white z-30 relative" style=
          {{
            transform: 'translateX(-45px)',
          }}>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
          <p className="text-sm font-bold text-gray-600 mb-6">Log through your social media account to continue</p>


          {/* Social Login Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => handleFacebookSignIn()}
            >
              <span className="font-medium">Facebook</span>
            </button>
            <button
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => handleGoogleSignIn()}
            >
              <span className="font-medium">Google</span>
            </button>
          </div>


          <div className="flex items-center my-6">
            <hr className="flex-grow" />
            <span className="px-2 text-sm font-bold text-grey-200">Enter your details below to login</span>
            <hr className="flex-grow" />
          </div>


          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Login
            </button>
          </form>
        </div>


        {/* Footer Links */}
        <div className="w-full max-w-md mt-4 text-sm text-center text-white z-30" style=
          {{
            transform: 'translateX(-45px)',
          }}>
          <div className="flex justify-between mb-4">
            <span className="text-white">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="underline hover:underline">
                Sign up
              </Link>
            </span>
            <a href="/auth/forgotpassword" className="underline hover:underline">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LoginWeb;