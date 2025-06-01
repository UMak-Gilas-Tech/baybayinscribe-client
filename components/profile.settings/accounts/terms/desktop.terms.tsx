"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

interface DesktopTermsProps {
  onClose: () => void;
  onProfileClick: () => void;
  onShowAbout: () => void;
  // onShowPreferences?: () => void;
}

export default function DesktopTerms({
  onClose,
  onProfileClick,
  onShowAbout,
}: DesktopTermsProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
      <div className="bg-black/50 fixed inset-0" onClick={onClose}></div>
      <div className="relative bg-blue-900 rounded-lg shadow-lg flex min-w-[850px] max-w-[100vw] max-h-[90vh]">
        {/* Left sidebar */}
        <div className="w-[250px] p-4 border-r border-blue-500 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>

          <nav className="space-y-1">
            <button
              onClick={onProfileClick}
              className="w-full py-2 text-blue-500 hover:text-blue-600 text-left cursor-pointer"
            >
              Account
            </button>

            <button className="w-full py-2 text-blue-300 font-bold text-left cursor-pointer">
              Terms of service
            </button>

            <button
              onClick={onShowAbout}
              className="w-full py-2 text-blue-500 hover:text-blue-600 text-left cursor-pointer"
            >
              About
            </button>
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-700 py-2 hover:text-blue-600 cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 17L21 12L16 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Log out
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <Image
              src="/images/user.profile/butty.waving.left.webp"
              alt="Butty mascot"
              width={250}
              height={250}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-7 relative overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-blue-300 font-semibold ">
              Terms of Service
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-blue-300 mb-6">
            Here&apos;s how we keep BaybayInscribe safe and respectful for
            everyone.
          </p>

          <div className="space-y-6">
            {/* Introduction */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-blue-300 font-bold">
                🟣 Introduction
              </h3>
              <div className="text-sm text-blue-300 pl-4 bg-neutral-white p-3 rounded-lg">
                By using our service, you&apos;re agreeing to these terms.
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-blue-300 font-bold">
                🔵 User Responsibilities
              </h3>
              <div className="text-sm text-blue-300 pl-4 bg-neutral-white p-3 rounded-lg">
                <p>We encourage you to follow respectful rules.</p>
                <p>Please adhere to our community guidelines.</p>
              </div>
            </div>

            {/* Prohibited Behavior */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-blue-300 font-bold">
                🔴 Prohibited Behavior
              </h3>
              <div className="text-sm text-blue-300 pl-4 bg-neutral-white p-3 rounded-lg">
                Engaging in cheating, harassment, hate speech, impersonation, or
                any form of abusive or disruptive activity is strictly
                prohibited.
              </div>
            </div>

            {/* Account and Data Handling */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-blue-300 font-bold">
                🟠 Account and Data Handling
              </h3>
              <div className="text-sm text-blue-300 pl-4 bg-neutral-white p-3 rounded-lg">
                Keep your account information secure. We&apos;ll notify you of
                changes regarding account policies and usage.
              </div>
            </div>

            {/* Termination */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-blue-300 font-bold">
                🟤 Termination
              </h3>
              <div className="text-sm text-blue-300 pl-4 bg-neutral-white p-3 rounded-lg">
                We may suspend or terminate accounts that violate our terms
                without prior notice.
              </div>
            </div>

            {/* Support Note */}
            <div className="text-sm text-blue-300 italic mt-8 mb-32">
              For any questions or concerns,
              <br />
              please contact support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
