"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

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

  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    dateOfBirth: ""
  });

  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.firstName || !form.lastName || !form.contactNumber || !form.dateOfBirth) {
      setGeneralError("Enter correct credentials.");
      setFieldErrors({
        username: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        dateOfBirth: ''
      });
      return;
    }

    let hasErrors = false;
    const newFieldErrors = {
      username: "",
      firstName: "",
      lastName: "",
      contactNumber: "",
      dateOfBirth: ""
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
        username: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        dateOfBirth: ''
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
          setFieldErrors(prevErrors => ({
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
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center relative overflow-y-auto"
      style={{
        backgroundImage: "url('/images/bg.phone.login.png')",
      }}
    >
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

      <div className="relative z-20 flex flex-col items-center w-full h-full pt-20 pb-16">
        <div className="w-full max-w-xs md:max-w-sm px-4">
          <h1
            className="text-2xl md:text-4xl font-bold text-[#FAD6A5] text-center mb-4"
          >
            USER INFORMATION
          </h1>
          <h1 className="text-sm font-bold text-[#FAD6A5] mt-6 mb-6">Great let us continue! Enter your details below</h1>

          <form className="space-y-2 mt-2" onSubmit={handleSubmit}>
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
              {fieldErrors.username && <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>}
            </div>

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
              {fieldErrors.firstName && <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>}
            </div>

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
              {fieldErrors.lastName && <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>}
            </div>

            <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
              Contact Number
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
              {fieldErrors.contactNumber && <p className="text-red-500 text-sm mt-1">{fieldErrors.contactNumber}</p>}
            </div>

            <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
              Date of Birth
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
              {fieldErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{fieldErrors.dateOfBirth}</p>}
            </div>

            {generalError && <p className="text-red-500 mb-4">{generalError}</p>}
            <button
              type="submit"
              className="w-full py-3 mt-8 bg-[#837EFF] text-white font-bold rounded-full hover:bg-[#7C67E8] transition cursor-pointer relative"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner loadingText="Saving..." /> : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoMobile;