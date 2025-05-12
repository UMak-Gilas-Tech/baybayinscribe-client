"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import DesktopEditProfile from "./edit.profile/desktop.edit";

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
  profilePictureUrl?: string | null;
};

type ProfileModalDesktopProps = {
  onClose: () => void;
  userData: UserData;
  onEdit?: () => void;
};

export default function ProfileModalDesktop({ onClose, userData, onEdit }: ProfileModalDesktopProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(userData);

  // Update currentUserData when userData prop changes
  useEffect(() => {
    setCurrentUserData(userData);
  }, [userData]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/login');
        }
      }
    });
  };

  // Handler for saving profile
  const handleSaveProfile = async (updatedData: UserData) => {
    try {
      // Prepare the data to be sent to the server
      const dataToUpdate = {
        ...updatedData,
        // Use the new profile picture URL if provided, otherwise keep the existing one
        profilePictureUrl: updatedData.profilePictureUrl ?? currentUserData.profilePictureUrl
      };

      const response = await fetch('/api/user.information/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update the local state with new data
      setCurrentUserData({
        ...updatedData,
        profilePictureUrl: dataToUpdate.profilePictureUrl,
        authProviders: updatedData.authProviders || currentUserData.authProviders
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      setIsEditing(true);
    }
  };

  // Only show edit profile component if we're managing edit state locally
  // and not delegating to parent component
  if (isEditing && !onEdit) {
    return (
      <DesktopEditProfile 
        onClose={() => setIsEditing(false)} 
        userData={currentUserData} 
        onSave={handleSaveProfile}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
      <div className="bg-black/50 fixed inset-0" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg flex min-w-[850px] max-w-[95vw]">
        {/* Left sidebar */}
        <div className="w-[250px] p-4 border-r border-blue-500">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>

          <nav className="space-y-1">
            <button className="w-full py-2 text-blue-600 font-medium text-left cursor-pointer">
              Account
            </button>
            <button className="w-full py-2 text-gray-700 hover:text-blue-600 text-left cursor-pointer">
              Preferences
            </button>
            <button className="w-full py-2 text-gray-700 hover:text-blue-600 text-left cursor-pointer">
              Terms of service
            </button>
            <button className="w-full py-2 text-gray-700 hover:text-blue-600 text-left cursor-pointer">
              About
            </button>
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-700 py-2 hover:text-blue-600 cursor-pointer"
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
          </div>

          <div className="mt-8">
            <button className="flex items-center text-red-600 hover:text-red-500 py-2 cursor-pointer mt-50">
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

        {/* Main content */}
        <div className="flex-1 p-7 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Account</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>          {/* User Profile */}
          <div className="flex items-center mb-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
              <Image
                src={currentUserData.profilePictureUrl || "/images/user.profile/user.avatar.png"}
                alt="User Profile"
                width={64}
                height={64}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{currentUserData.firstName} {currentUserData.lastName}</h3>
              <p className="text-sm text-gray-500">{currentUserData.username}</p>
              <button 
                onClick={handleEditClick}
                className="text-blue-600 text-sm flex items-center hover:text-blue-700 cursor-pointer"
              >
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
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Account Info</h3>
              <div className="flex items-center">
                <Image
                  src="/images/user.profile/butty.stand.png"
                  alt="Butty mascot"
                  width={40}
                  height={40}
                  className="object-cover w-25 h-full ml-20"
                  style={{ transform: "translateY(30px)" }}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center">
                <Image
                  src="/images/user.profile/phone.icon.png"
                  alt="Phone Icon"
                  width={20}
                  height={20}
                  className="mr-3"
                />
                <span>{currentUserData.contactNumber}</span>
              </div>

              <div className="flex items-center">
                <Image
                  src="/images/user.profile/calendar.icon.png"
                  alt="Calendar Icon"
                  width={20}
                  height={20}
                  className="mr-3"
                />
                <span>
                  Date of Birth: {currentUserData.dateOfBirth ? new Date(currentUserData.dateOfBirth).toLocaleDateString(
                    'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ""}
                </span>
              </div>

              <div className="flex items-center">
                <Image
                  src="/images/user.profile/mail.icon.png"
                  alt="Email Icon"
                  width={20}
                  height={20}
                  className="mr-3"
                />
                <span>{currentUserData.email}</span>
              </div>
            </div>
          </div>

          {/* Auth Provider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-gray-800">Auth Provider</h3>
              <div>
                <Image
                  src="/images/user.profile/butty.thumbsup.png"
                  alt="Butty giving thumbs up"
                  width={80}
                  height={80}
                  className="object-cover w-25 h-full ml-20"
                  style={{ transform: "translateY(30px)" }}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              {!currentUserData.authProviders?.length && (
                <div className="text-gray-500">No authentication providers linked</div>
              )}
              {currentUserData.authProviders?.map((provider, index) => (
                <div key={`${provider.name}-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Image
                      src={`/images/user.profile/${provider.name.toLowerCase()}.icon.account.png`}
                      alt={provider.name}
                      width={20}
                      height={20}
                      className="mr-3"
                    />
                    <span>{provider.name} Linked</span>
                  </div>
                  <button className="text-red-600 text-sm">Unlink</button>
                </div>
              ))}
            </div>
          </div>

          {/* Butty mascot at bottom */}
          <div className="absolute bottom-0 right-0">
            <Image
              src="/images/user.profile/butty.waving.png"
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