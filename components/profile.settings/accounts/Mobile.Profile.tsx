"use client"

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

type AuthProvider = {
  name: string;
  linked: boolean;
};

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  contactNumber?: string;
  dateOfBirth?: string;
  email: string;
  authProviders?: AuthProvider[];
};

type ProfileModalMobileProps = {
  userData: UserData;
  onClose: () => void;
};

export default function ProfileModalMobile({ userData, onClose }: ProfileModalMobileProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/login');
        },
      },
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex w-full">
          <button className="flex-1 py-3 text-center text-blue-600 font-semibold border-b-2 border-blue-600">
            <Image
              src="/images/user.profile/butty.stand.png"
              alt="Profile Icon"
              width={40}
              height={40}
              className="inline-block mr-2"
            />
            Profile
          </button>
          <button className="flex-1 py-3 text-center text-gray-500 hover:text-blue-600">
            <Image
              src="/images/user.profile/butty.tonguecheek.png"
              alt="Settings Icon"
              width={30}
              height={30}
              className="inline-block mr-2"
            />
            Settings
          </button>
        </div>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* Profile Section */}
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
            <Image
              src="/images/user.profile/user.avatar.png"
              alt="User Profile"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{userData.firstName} {userData.lastName}</h3>
            <p className="text-sm text-gray-500">@{userData.username}</p>
            <button className="text-blue-600 text-sm flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Account Info Section */}
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Account Info</h3>
          <Image
            src="/images/user.profile/butty.stand.png"
            alt="Butty mascot"
            width={24}
            height={24}
            className="object-cover w-25 h-full ml-15 hidden xs:block"
            style={{ transform: "translateY(30px)" }}
          />
        </div>
        <div className="bg-blue-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center">
            <Image
              src="/images/user.profile/phone.icon.png"
              alt="Phone Icon"
              width={20}
              height={20}
              className="mr-3"
            />
            <span>{userData.contactNumber}</span>
          </div>
          <div className="flex items-center">
            <Image
              src="/images/user.profile/calendar.icon.png"
              alt="Calendar Icon"
              width={20}
              height={20}
              className="mr-3"
            />
            <span>Date of Birth: {userData.dateOfBirth}</span>
          </div>
          <div className="flex items-center">
            <Image
              src="/images/user.profile/mail.icon.png"
              alt="Email Icon"
              width={20}
              height={20}
              className="mr-3"
            />
            <span>{userData.email}</span>
          </div>
        </div>
      </div>

      {/* Auth Provider Section */}
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Auth Provider</h3>
          <Image
            src="/images/user.profile/butty.thumbsup.png"
            alt="Butty giving thumbs up"
            width={24}
            height={24}
            className="object-cover w-25 h-full ml-15 hidden xs:block"
            style={{ transform: "translateY(30px)" }}
          />
        </div>


        {/* Google Provider */}
        <div className="bg-blue-50 p-4 rounded-lg space-y-3">
          {userData.authProviders && userData.authProviders.length > 0 ? (
            userData.authProviders.map((provider, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={`/images/user.profile/google.icon.account.png`}
                    alt={provider.name}
                    width={20}
                    height={20}
                    className="mr-3"
                  />
                  <span>{provider.name} Linked</span>
                </div>
                <button className="text-red-600 text-sm">Unlink</button>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No authentication providers linked</div>
          )}

          {/* Facebook Provider */}
          {userData.authProviders && userData.authProviders.length > 0 ? (
            userData.authProviders.map((provider, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={`/images/user.profile/facebook.icon.account.png`}
                    alt={provider.name}
                    width={20}
                    height={20}
                    className="mr-3"
                  />
                  <span>Facebook Account Linked</span>
                </div>
                <button className="text-red-600 text-sm">Unlink</button>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No authentication providers linked</div>
          )}


          {/* Delete Account*/}
          <div className="mt-2 mb-2">
            <button className="flex items-center text-red-600">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Log out button */}
      <div className="mt-auto p-4 border-gray-200 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center text-gray-700 py-2 hover:text-blue-600"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path d="M16 17L21 12L16 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path d="M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

          </svg>
          Log out
        </button>

        {/* Butty mascot at bottom */}
        <div className="absolute bottom-0 right-0">
          <Image
            src="/images/user.profile/butty.waving.png"
            alt="Butty mascot"
            width={150}
            height={150}
            className="hidden xs:block"
          />
        </div>
      </div>

    </div>
  );
}