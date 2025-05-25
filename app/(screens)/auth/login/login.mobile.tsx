"use client";
import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Image from "next/image"; 
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const LoginMobile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); // reset error before attempt
    setValidationError("");
    setIsLoading(true);
    // If both fields are empty
    if (!email && !password) {
      setValidationError("Enter email and password credentials");
      setIsLoading(false);
      return;
    }
    // Zod validation
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setValidationError(result.error.errors[0].message);
      setIsLoading(false);
      return;
    }
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
          setIsLoading(false);
        },
      });
    } catch {
      setLoginError("Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", 
      });
    } catch {
      setLoginError("Failed to sign in with Google. Please try again.");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "facebook",
        callbackURL: "/",
      });
    } catch {
      setLoginError("Failed to sign in with Facebook. Please try again.");
    }
  };


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-end bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: "url('/images/bg.phone.login.png')" }}
    >
      {/* Whale Design */}
      <div
        className="absolute top-0 z-10"
        style={{
          width: "130vw",
          height: "60vh",
          left: "-10vw",
          top: "-2vh",
        }}
      >
        <Image
          src="/images/butty.login.png"
          alt="Whale Design"
          layout="fill" 
          objectFit="contain" 
          priority 
        />
      </div>

      {/* Wave Design */}
      <div
        className="absolute z-20 bg-cover bg-center"
        style={{
          width: "100%",
          minHeight: "75vh",
          height: "75vh",
          bottom: "0",
          backgroundImage: "url('/images/vector.bg.png')",
          MozBackgroundSize: "cover",
          backgroundSize: "100% 120%",
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
              className="text-3xl md:text-4xl font-bold text-[#FAD6A5] text-center"
              style={{
                marginTop: "-15vh",
                marginLeft: "-50px",
              }}
            >
              BAYBAYINSCRIBE
            </h1>

            {/* Form Heading */}
            <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5] mt-16 ml-6">
              Log In
            </h2>

            {/* Login Form */}
            <form className="space-y-4 mt-2 ml-4 mr-4" onSubmit={handleLogin}>
              <div>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>
              <div className="flex flex-col md:flex-row justify-between text-xs text-[#FFD8B9]">
                <span>
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" className="underline text-[#00C8FF] hover:text-[#00eeff]">
                    Sign up
                  </Link>
                  
                  <span className="mx-2">|</span>
                  <Link href="/auth/forgotpassword" className="underline text-[#00C8FF] hover:text-[#00eeff]">
                    Forgot password?
                  </Link>
                </span>
              </div>

              {validationError && <p className="text-red-500 mb-4">{validationError}</p>}
              {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-[#837EFF] text-white font-bold rounded-full hover:bg-[#7C67E8] transition cursor-pointer relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner loadingText="Signing in..." />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-black" />
              <span className="px-2 text-sm text-black">or</span>
              <hr className="flex-grow border-black" />
            </div>

            {/* Social Login */}
            <div className="flex justify-center gap-12">
              <button 
                className="w-12 h-12 bg-transparent flex items-center justify-center rounded-md shadow-md cursor-pointer"
                onClick={handleFacebookSignIn}
              >
                <Image
                  src="/images/fb.icon.png"
                  alt="Facebook Icon"
                  width={48}
                  height={48}
                />
              </button>
              <button 
                className="flex items-center justify-center cursor-pointer"
                onClick={handleGoogleSignIn}
              >
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

export default LoginMobile;