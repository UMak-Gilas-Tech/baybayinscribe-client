"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const UserInfoWeb = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    dateOfBirth: "",
    agreedToTerms: true,
    wantsNotifications: false,
  });

  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    dateOfBirth: "",
  });

  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.username ||
      !form.firstName ||
      !form.lastName ||
      !form.contactNumber ||
      !form.dateOfBirth
    ) {
      setGeneralError("Enter correct credentials.");
      setFieldErrors({
        username: "",
        firstName: "",
        lastName: "",
        contactNumber: "",
        dateOfBirth: "",
      });
      return;
    }

    let hasErrors = false;
    const newFieldErrors = {
      username: "",
      firstName: "",
      lastName: "",
      contactNumber: "",
      dateOfBirth: "",
    };

    if (form.contactNumber && !/^\d{11}$/.test(form.contactNumber)) {
      newFieldErrors.contactNumber = "Contact number form not valid.";
      hasErrors = true;
    }

    if (form.username.length > 15) {
      newFieldErrors.username = "Username must be less than 15 characters.";
      hasErrors = true;
    }

    if (form.firstName.length > 15) {
      newFieldErrors.firstName = "First name must be less than 15 characters.";
      hasErrors = true;
    }

    if (form.lastName.length > 15) {
      newFieldErrors.lastName = "Last name must be less than 15 characters.";
      hasErrors = true;
    }

    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 8) {
        newFieldErrors.dateOfBirth = "Age must be at least 8 years old.";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      setGeneralError("");
      setIsLoading(false);
      return;
    } else {
      setFieldErrors({
        username: "",
        firstName: "",
        lastName: "",
        contactNumber: "",
        dateOfBirth: "",
      });
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/user.information", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        localStorage.setItem("userInfo", JSON.stringify(form));
        router.push("/auth/terms");
      } else {
        const data = await res.json();

        if (data.error && data.error === "Username already taken") {
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            username: data.error,
          }));
          setGeneralError("");
        } else if (data.error) {
          setGeneralError(data.error);
        } else {
          setGeneralError("Failed to submit information.");
        }
      }
    } catch (err) {
      console.error(err);
      setGeneralError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex relative overflow-hidden bg-blue-400 z-0">
      <svg
        className="absolute top-0 right-0 left-60 w-full h-full z-20 pointer-events-none"
        viewBox="0 0 953 1117"
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

      <h1
        className="absolute z-30 text-4xl lg:text-5xl font-bold text-yellow-200"
        style={{
          top: "50%",
          left: "28%",
          transform: "translateX(-50%)",
          fontSize: "5vw",
        }}
      >
        USER INFORMATION
      </h1>

      <div className="flex-1 relative flex items-center justify-center bg-blue-400 z-0" />

      <div className="flex-1 flex flex-col items-center justify-center bg-blue-500 relative z-20 w-[50%] ml-70">
        <div
          className="w-full max-w-sm p-4 rounded-lg shadow-lg bg-white z-30 relative"
          style={{ transform: "translateX(-35px)" }}
        >
          <h1 className="text-sm font-bold text-gray-600 mb-6">
            Great let us continue! Enter your details below
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={form.username}
                onChange={handleChange}
                maxLength={30}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-sm mb-4">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={form.firstName}
                onChange={handleChange}
                maxLength={30}
                placeholder="Enter your first name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.firstName && (
                <p className="text-red-500 text-sm mb-4">
                  {fieldErrors.firstName}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={form.lastName}
                onChange={handleChange}
                maxLength={30}
                placeholder="Enter your last name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.lastName && (
                <p className="text-red-500 text-sm mb-4">
                  {fieldErrors.lastName}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder="Enter your contact number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.contactNumber && (
                <p className="text-red-500 text-sm mb-4">
                  {fieldErrors.contactNumber}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.dateOfBirth && (
                <p className="text-red-500 text-sm mb-4">
                  {fieldErrors.dateOfBirth}
                </p>
              )}
            </div>

            {generalError && (
              <p className="text-red-500 text-sm mb-4">{generalError}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition cursor-pointer relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner loadingText="Saving..." />
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoWeb;
