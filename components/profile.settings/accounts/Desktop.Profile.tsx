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
  contactNumber: string;
  dateOfBirth?: string;
  email: string;
  authProviders?: AuthProvider[];
};

type ProfileModalDesktopProps = {
  userData: UserData;
  onClose: () => void;
};

export default function ProfileModalDesktop({ userData, onClose }: ProfileModalDesktopProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/login');
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black/50 fixed inset-0" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg flex w-full max-w-4xl">
        {/* Left sidebar */}
        <div className="w-[240px] p-4 border-r border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>

          <nav className="space-y-1">
            <button className="w-full py-2 text-blue-600 font-medium text-left">
              Account
            </button>
            <button className="w-full py-2 text-gray-700 hover:text-blue-600 text-left">
              Preferences
            </button>
            <button className="w-full py-2 text-gray-700 hover:text-blue-600 text-left">
              Terms of service
            </button>
            <button className="w-full py-2 text-gray-700 hover:text-blue-600 text-left">
              About
            </button>
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-700 py-2 hover:text-blue-600"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Log out
            </button>
          </div>

          <div className="mt-8">
            <button className="flex items-center text-red-600 py-2">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Delete Account
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 relative" style={{ backgroundImage: 'url("/images/grid-bg.png")', backgroundSize: 'cover' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Account</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor" />
                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{userData.firstName} {userData.lastName}</h3>
              <p className="text-sm text-gray-500">{userData.username}</p>
              <button className="text-blue-600 text-sm flex items-center">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Account Info</h3>
              <div>
                <Image
                  src="/images/butty.stand.png"
                  alt="Butty mascot"
                  width={30}
                  height={30}
                />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.9V19.9C22 20.4 21.6 21 21 21C18.3 21 15.6 20.1 13.4 18.4C11.2 16.8 9.5 14.6 8.5 12.1C7.4 9.7 7 7 7.1 4.3C7.1 3.7 7.7 3.2 8.2 3.2H11.2C11.7 3.2 12.1 3.6 12.2 4.1C12.3 5.1 12.5 6 12.8 6.9C13 7.4 12.8 7.9 12.4 8.2L10.8 9.8C11.7 12.1 13.7 14 16 15C16.4 14.6 17 14.4 17.6 14.6C18.4 14.9 19.4 15.1 20.3 15.2C20.9 15.4 21.3 15.9 22 16.9Z" fill="currentColor" />
                </svg>
                <span>{userData.contactNumber}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Date of Birth: {userData.dateOfBirth}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{userData.email}</span>
              </div>
            </div>
          </div>

          {/* Auth Provider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Auth Provider</h3>
              <div>
                <Image
                  src="/images/butty.thumbsup.png"
                  alt="Butty giving thumbs up"
                  width={30}
                  height={30}
                />
              </div>
            </div>


            {/* Google Provider */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              {userData.authProviders && userData.authProviders.length > 0 ? (
                userData.authProviders.map((provider, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image
                        src={`/images/google.icon.account.png`}
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
            </div>


            {/* Facebook Provider */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              {userData.authProviders && userData.authProviders.length > 0 ? (
                userData.authProviders.map((provider, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image
                        src={`/images/facebook.icon.account.png`}
                        alt={provider.name}
                        width={20}
                        height={20}
                        className="mr-3"
                      />
                      <span>Facebook Linked</span>
                    </div>
                    <button className="text-red-600 text-sm">Unlink</button>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No authentication providers linked</div>
              )}
            </div>
          </div>


          {/* Butty mascot at bottom */}
          <div className="absolute bottom-0 right-0">
            <Image
              src="/images/butty.waving.png"
              alt="Butty mascot"
              width={120}
              height={120}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 