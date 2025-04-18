"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const ProfPicMobile = () => {
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
              className="text-2xl md:text-4xl text-[#FAD6A5] text-center mb-8"
            >
              PROFILE PICTURE
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

            {/* Upload Button */}
            <button
              type="button"
              className="w-4/5 py-3 mb-4 bg-[#837EFF] text-white font-semibold rounded-full hover:bg-[#7C67E8] transition"
            >
              Upload
            </button>

            {/* Skip Link */}
            <Link href="/auth/terms" className="text-[#FAD6A5] underline hover:underline">
              Skip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfPicMobile;