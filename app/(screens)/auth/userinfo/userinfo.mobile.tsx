"use client";

import React from "react";

const UserInfoMobile = () => {
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
          minHeight: "105vh",
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
            height: "80vh",
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
                marginTop: "-32vh",
                marginLeft: "-50px",
              }}
            >
              USER INFORMATION
            </h1>
            <h1 className="text-sm font-bold text-[#FAD6A5] mt-6 mb-6">Great let us continue! Enter your details below</h1> 

            {/* Form */}
            <form className="space-y-4 mt-4 ml-2 mr-2">
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
                />
              </div>

              {/* First Name */}
              <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
                First Name
              </h2>
              <div>
                <input
                  type="text"
                  id="firstname"
                  placeholder="Enter your first name"
                  className="w-full px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />  
              </div>

              {/* Last Name */}
              <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
                Last Name
              </h2>
              <div>
                <input
                  type="text"
                  id="lastname"
                  placeholder="Enter your last name"
                  className="w-full px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Contact Number */}
              <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
                Contact Number (Optional)
              </h2>
              <div>
                <input
                  type="tel"
                  id="contact.number"
                  placeholder="Enter your contact number"
                  className="w-full px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date of Birth */}
              <h2 className="text-base md:text-lg font-semibold text-[#FAD6A5]">
                Date of Birth (Optional)
              </h2>
              <div>
                <input
                  type="date"
                  id="dob"
                  placeholder="Select your date of birth"
                  className="w-full px-3 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 mt-6 bg-[#837EFF] text-white font-bold rounded-full hover:bg-[#7C67E8] transition"
              >
                Continue
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoMobile;