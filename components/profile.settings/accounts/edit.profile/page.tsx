"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock user data - replace with actual user data fetching and updating
const mockUser = {
  firstName: "Juan",
  lastName: "Dela Cruz",
  username: "@JuwanDlckruz",
  contactNumber: "09999999999",
  dateOfBirth: "2002-04-12", // Format for date input
  email: "juandelacruz@gmail.com",
};

export default function EditProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(mockUser);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData({ ...userData, [id]: value });
    
    // Clear error when user types
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const handleSave = () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!userData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!userData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!userData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!/^@[\w\d]+$/.test(userData.username)) {
      newErrors.username = "Username must start with @ and contain only letters and numbers";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save the user data to database
    // This would be replaced with an API call
    console.log("Saving user data:", userData);
    
    // Redirect back to profile page
    router.push("/profile/accounts/settings");
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <Link href="/profile" className="flex-1 py-3 text-center bg-blue-50 text-blue-700 font-medium border-b-2 border-blue-700">
            <span className="flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
              </svg>
              Profile
            </span>
          </Link>
          <Link href="/settings" className="flex-1 py-3 text-center text-gray-600 font-medium">
            <span className="flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C11.4477 2 11 2.44772 11 3V4.06189C9.20497 4.51314 7.73829 5.76747 7 7.4453L6.11102 7.05279C5.59435 6.86273 5.01486 7.05573 4.82481 7.5724C4.63475 8.08907 4.82775 8.66856 5.34442 8.85862L6.23856 9.25315C6.08519 9.81631 6 10.4017 6 11C6 11.5983 6.08519 12.1837 6.23856 12.7468L5.34442 13.1414C4.82775 13.3314 4.63475 13.9109 4.82481 14.4276C5.01486 14.9443 5.59435 15.1373 6.11102 14.9472L7 14.5547C7.73829 16.2325 9.20497 17.4869 11 17.9381V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V17.9381C14.795 17.4869 16.2617 16.2325 17 14.5547L17.889 14.9472C18.4057 15.1373 18.9851 14.9443 19.1752 14.4276C19.3653 13.9109 19.1723 13.3314 18.6556 13.1414L17.7614 12.7468C17.9148 12.1837 18 11.5983 18 11C18 10.4017 17.9148 9.81631 17.7614 9.25315L18.6556 8.85862C19.1723 8.66856 19.3653 8.08907 19.1752 7.5724C18.9851 7.05573 18.4057 6.86273 17.889 7.05279L17 7.4453C16.2617 5.76747 14.795 4.51314 13 4.06189V3C13 2.44772 12.5523 2 12 2Z" fill="currentColor"/>
              </svg>
              Settings
            </span>
          </Link>
        </div>

        <div className="p-4">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Edit Your Account</h2>
            <Link href="/profile" className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </Link>
          </div>

          {/* Profile picture */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Picture</h3>
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-3 relative overflow-hidden">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1 text-sm bg-blue-50 text-blue-700 rounded-full">Change</button>
                <button className="px-4 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">Remove</button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center px-4">
                Upload a image (max 5MB/file, max 4MB). Make sure your picture
                follows the Community. Supported formats: JPG, JPEG, PNG
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={userData.firstName}
                onChange={handleChange}
                placeholder="Use your real or preferred name for your profile"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={userData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
                <span className="block text-xs text-gray-500">Unique, includes letters, numbers. No spaces or special characters.</span>
              </label>
              <input
                type="text"
                id="username"
                className={`w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={userData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userData.contactNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of birth
                <span className="block text-xs text-gray-500">(MM/DD/YYYY). This will not be shown publicly.</span>
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="pt-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Link href="/profile/settings/accounts" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md font-medium">
                Cancel
              </Link>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 