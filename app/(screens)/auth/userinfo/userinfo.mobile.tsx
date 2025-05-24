"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const UserInfoMobile = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    dateOfBirth: "",
    agreedToTerms: true,
    wantsNotifications: false
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Contact number validation
    if (form.contactNumber && !/^\d{11}$/.test(form.contactNumber)) {
      setError("Contact number form not valid.");
      return;
    }

    //username validation
    if (form.username.length > 15) {
      setError("Username must be less than 15 characters.");
      return;
    }

    //firstname validation
    if (form.firstName.length > 15) {
      setError("First name must be less than 15 characters.");
      return;
    }

    //lastname validation
    if (form.lastName.length > 15) {
      setError("Last name must be less than 15 characters.");
      return;
    }

    // Date of birth validation
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 8) {
        setError("Age must be at least 8 years old.");
        return;
      }
    }

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
        setError(data.error || "Failed to submit information.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center relative overflow-y-auto"
      style={{
        backgroundImage: "url('/images/bg.phone.login.png')",
      }}
    >

      {/* Wave Design */}
      <div
        className="fixed bottom-0 left-0 right-0 z-10 bg-cover bg-center"
        style={{
          width: "150%",
          minHeight: "100vh",
          backgroundImage: "url('/images/vector.bg.png')",
          backgroundSize: "100% 115%",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center w-full h-full pt-20 pb-16">
        <div className="w-full max-w-xs md:max-w-sm px-4">
          {/* Title */}
          <h1
            className="text-2xl md:text-4xl font-bold text-[#FAD6A5] text-center mb-4"
          >
            USER INFORMATION
          </h1>
          <h1 className="text-sm font-bold text-[#FAD6A5] mt-6 mb-6">Great let us continue! Enter your details below</h1>

          {/* Form */}
          <form className="space-y-2 mt-2" onSubmit={handleSubmit}>
            {/* Username */}
            <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
              Username
            </h2>
            <div>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="w-full px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            {/* First Name */}
            <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
              First Name
            </h2>
            <div>
              <input
                type="text"
                id="firstName"
                placeholder="Enter your first name"
                className="w-full px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>

            {/* Last Name */}
            <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
              Last Name
            </h2>
            <div>
              <input
                type="text"
                id="lastName"
                placeholder="Enter your last name"
                className="w-full px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            {/* Contact Number */}
            <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
              Contact Number (Optional)
            </h2>
            <div>
              <input
                type="tel"
                id="contactNumber"
                placeholder="Enter your contact number"
                className="w-full px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.contactNumber}
                onChange={handleChange}
              />
            </div>

            {/* Date of Birth */}
            <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
              Date of Birth (Optional)
            </h2>
            <div>
              <input
                type="date"
                id="dateOfBirth"
                placeholder="Select your date of birth"
                className="w-full px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 mt-8 bg-[#837EFF] text-white font-bold rounded-full hover:bg-[#7C67E8] transition cursor-pointer"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoMobile;