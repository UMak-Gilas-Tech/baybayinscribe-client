"use client";
import React from "react";
import Image from "next/image";

const TermsServicesMobile = () => { 
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
          className="absolute z-20 bg-cover bg-center flex flex-col items-center justify-start pt-[15vh]"
          style={{
            width: "100%",
            height: "80vh",
            bottom: "0",
            backgroundImage: "url('/images/vector.bg.png')",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Content Container */}
          <div className="w-full max-w-xs md:max-w-sm flex flex-col items-center">
            {/* Title */}
            <h1
              className="text-2xl md:text-4xl text-[#FAD6A5] text-center mb-8 font-bold"
            >
              Terms and Agreement
            </h1>

            {/* Profile Picture Placeholder */}
            <div className="mb-8">
              <Image
                src="/images/profpic.placeholder.png"
                alt="Profile Picture Placeholder"
                width={150}
                height={150}
                className="rounded-full"
              />
            </div>

            {/* Instructions Text */}
            <p className="text-[#FAD6A5] text-center mb-6">
              Please check the box below
            </p>

            {/* Checkboxes */}
            <div className="w-full flex flex-col items-start space-y-3 mb-6 px-4">
              <div className="flex items-center">
                <input type="checkbox" id="terms" className="mr-2 accent-[#837EFF]" />
                <label htmlFor="terms" className="text-sm text-[#FAD6A5]">
                  Yes, I agree to the <a href="#" className="text-blue-100 underline">Terms of Service</a>.
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="notifications" className="mr-2 accent-[#837EFF]" />
                <label htmlFor="notifications" className="text-sm text-[#FAD6A5]">
                  Yes, I want to be notified of upcoming offers, events, and latest news.
                </label>
              </div>
            </div>

            {/* Finish Registration Button */}
            <button
              type="button"
              className="w-4/5 py-3 mb-4 bg-[#837EFF] text-white font-semibold rounded-full hover:bg-[#7C67E8] transition"
            >
              Finish Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsServicesMobile;