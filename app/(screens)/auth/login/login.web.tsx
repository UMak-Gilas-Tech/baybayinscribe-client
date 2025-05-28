"use client";

// --- Imports ---
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeClosed } from "lucide-react";

// UI Components
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form as ShadcnForm,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// --- Validation Schema ---
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const LoginWeb = () => {
  // --- Hooks ---
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Handlers ---
  const handleLogin = async (values: { email: string; password: string }) => {
    setLoginError("");
    setIsLoading(true);
    try {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            setLoginError(ctx.error?.message || "This account does not exist.");
            setIsLoading(false);
          },
        }
      );
    } catch {
      setLoginError("Failed to sign in. Please try again.");
      setIsLoading(false);
    }
    setIsLoading(false);
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
    <div className="h-screen flex relative overflow-hidden bg-blue-400 z-0">
      {/* --- Background Vector SVG --- */}
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

      {/* --- Background Image --- */}
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

      {/* --- Whale Design --- */}
      <div
        className="absolute z-20"
        style={{
          width: "130vw",
          height: "30vh",
          left: "-32vw",
          top: "38vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/images/butty.login.png"
          alt="Whale"
          width={600}
          height={100}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
      <h1
        className="absolute z-30 text-4xl lg:text-5xl font-bold text-[#FFD8B9]"
        style={{
          top: "50%",
          left: "28%",
          transform: "translateX(-50%)",
          fontSize: "6vw",
        }}
      >
        BAYBAYINSCRIBE
      </h1>

      {/* --- Left Section (empty for layout) --- */}
      <div className="flex-1 relative flex items-center justify-center bg-blue-400 z-0"></div>

      {/* --- Right Section (Login Form) --- */}
      <div className="flex-1 flex flex-col items-center justify-center bg-blue-500 relative z-20 w-[50%] ml-70">
        {/* --- Login Form Card --- */}
        <Card
          className="w-full max-w-md bg-neutral-white border border-blue-400 shadow-xl rounded-xl z-30 relative"
          style={{ transform: "translateX(-45px)" }}
        >
          <CardHeader>
            <CardTitle className="text-blue-400">Login</CardTitle>
            <CardDescription className="text-gray-500">
              Log through your social media account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-full">
            {/* --- Social Login Buttons --- */}
            <div className="flex gap-4 mb-6">
              <Button
                variant="outline"
                className="flex-1 flex items-center gap-2 border-blue-400 text-blue-400 bg-neutral-white hover:bg-blue-900 transition"
                onClick={() => handleFacebookSignIn()}
                type="button"
              >
                <FaFacebook size={20} />
                Facebook
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex items-center gap-2 border-blue-400 text-blue-400 bg-neutral-white hover:bg-blue-900 transition"
                onClick={() => handleGoogleSignIn()}
                type="button"
              >
                <FcGoogle size={20} />
                Google
              </Button>
            </div>

            <div className="flex items-center my-6 w-full justify-center">
              <Separator className="flex-1 bg-blue-400" />
              <span className="px-4 text-sm font-medium text-blue-400 text-center whitespace-nowrap">
                Enter your details below to login
              </span>
              <Separator className="flex-1 bg-blue-400" />
            </div>

            <ShadcnForm {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-400 font-semibold">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="bg-neutral-white border border-blue-400 focus:border-blue-400 focus:ring-blue-400 text-neutral-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-400 font-semibold">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="bg-neutral-white border border-blue-400 focus:border-blue-400 focus:ring-blue-400 text-neutral-black"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-blue-400"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeClosed className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loginError && (
                  <p className="text-red-800 border border-red-700 rounded px-2 py-1 mb-2 text-xs font-medium animate-shake">
                    {loginError}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-400 text-neutral-white hover:bg-blue-600 transition font-bold py-2 rounded-lg shadow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner loadingText="Logging in..." />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </ShadcnForm>
          </CardContent>
        </Card>

        {/* --- Footer Links --- */}
        <div
          className="w-full max-w-md mt-4 text-sm text-center text-neutral-black z-30"
          style={{ transform: "translateX(-45px)" }}
        >
          <div className="flex justify-between mb-4 text-neutral-white">
            <span>
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="underline text-yellow-300 hover:no-underline font-semibold"
              >
                Sign up
              </Link>
            </span>
            <Link
              href="/auth/forgotpassword"
              className="underline text-yellow-300 hover:no-underline font-semibold"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginWeb;
