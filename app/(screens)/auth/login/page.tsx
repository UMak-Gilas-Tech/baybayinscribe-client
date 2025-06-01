"use client";

// --- Imports ---
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createLoginHandlers } from "./handlers";
import { LoginForm } from "./LoginForm";
import { Background } from "../components/Background";

const LoginPage = () => {
  // --- Hooks ---
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---
  const { handleLogin, handleGoogleSignIn, /*handleFacebookSignIn,*/ handleRedditSignIn } =
    createLoginHandlers({
      router,
      setLoginError,
      setValidationError,
      setIsLoading,
    });

  return (
    <Background>
      <LoginForm
        error={""}
        onSubmit={handleLogin}
        // onFacebookSignIn={handleFacebookSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onRedditSignIn={handleRedditSignIn}
        loginError={loginError}
        validationError={validationError}
        isLoading={isLoading}
      />
    </Background>
  );
};

export default LoginPage;
