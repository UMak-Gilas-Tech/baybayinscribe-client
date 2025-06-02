import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import MobileSettings from "../mobile.settings";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

interface MobileTermsProps {
  onClose: () => void;
  onProfileClick?: () => void;
}

export const MobileTerms: React.FC<MobileTermsProps> = ({ onClose }) => {
  const router = useRouter();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  const handleProfileClick = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-blue-900 z-50 overflow-y-auto">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 ">
        <div className="flex w-full">
          <button
            onClick={handleProfileClick}
            className="flex-1 py-3 text-center font-semibold cursor-pointer text-gray-500"
          >
            <Image
              src="/images/user.profile/butty.stand.webp"
              alt="Profile Icon"
              width={40}
              height={40}
              className="inline-block mr-2"
            />
            Profile
          </button>
          <button
            onClick={() => setIsSettingsVisible(true)}
            className="flex-1 py-3 text-center font-semibold cursor-pointer text-blue-600 border-b-2 border-blue-600"
          >
            <Image
              src="/images/user.profile/butty.tonguecheek.webp"
              alt="Settings Icon"
              width={30}
              height={30}
              className="inline-block mr-2"
            />
            Settings
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-blue-300">
            Terms of Service
          </h2>
        </div>

        <p className="text-sm text-blue-300">
          Here&apos;s how we keep BaybayInscribe safe and respectful for
          everyone.
        </p>

        {/* Introduction */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2  text-blue-300 font-bold">
            🟣 Introduction
          </h3>
          <div className="pl-4 bg-neutral-white p-3 rounded-lg">
            <p className="text-sm text-blue-300">
              By using our service, you&apos;re agreeing to these terms.
            </p>
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
          <div className="pl-4 bg-neutral-white p-3 rounded-lg">
            <p className="text-sm text-blue-300">
              Engaging in cheating, harassment, hate speech, impersonation, or
              any form of abusive or disruptive activity is strictly prohibited.
            </p>
          </div>
        </div>

        {/* Account and Data Handling */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-blue-300 font-bold">
            🟠 Account and Data Handling
          </h3>
          <div className="pl-4 bg-neutral-white p-3 rounded-lg">
            <p className="text-sm text-blue-300">
              Keep your account information secure. We&apos;ll notify you of
              changes regarding account policies and usage.
            </p>
          </div>
        </div>

        {/* Termination */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-blue-300 font-bold">
            🟤 Termination
          </h3>
          <div className=" bg-neutral-white p-3 rounded-lg">
            <p className="text-sm text-blue-300">
              We may suspend or terminate accounts that violate our terms
              without prior notice.
            </p>
          </div>
        </div>

        {/* Support Note */}
        <div className="text-sm text-blue-300 italic mt-8 text-left">
          For any questions or concerns,
          <br />
          please contact support
        </div>
        {/* Butty mascot at bottom */}
        <div className="fixed bottom-0 right-5 pointer-events-none">
          <Image
            src="/images/user.profile/butty.waving.webp"
            alt="Butty mascot"
            width={150}
            height={150}
            className="hidden xs:block"
          />
        </div>
      </div>

      {/* Settings Overlay */}
      <MobileSettings
        isVisible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default MobileTerms;
