"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createRegisterHandlers } from "./handlers";
import { RegisterForm } from "./RegisterForm";
import { Background } from "../components/Background";

const RegisterPage = () => {
  // --- Hooks ---
  const router = useRouter();
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---
  const { handleRegister, handleGoogleSignIn, handleRedditSignIn } =
    createRegisterHandlers({
      router,
      setError,
      setLoginError,
      setValidationError,
      setIsLoading,
    });

  return (
    <Background>
      <RegisterForm
        onSubmit={handleRegister}
        onRedditSignIn={handleRedditSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        error={error}
        loginError={loginError}
        validationError={validationError}
        isLoading={isLoading}
      />
    </Background>
  );
};

export default RegisterPage;
