"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserInfoForm } from "./UserInfoForm";
import type { UserInfoFormData } from "./handlers";
import { Background } from "../components/Background";

export default function UserInfoPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: UserInfoFormData) => {
    try {
      setIsLoading(true);
      setError("");
      // TODO: Implement your form submission logic here
      console.log("Form values:", values);
      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      <UserInfoForm
        onSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </Background>
  );
}
