"use client"

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  contactNumber?: string;
  dateOfBirth?: string;
  email: string;
  profilePictureUrl?: string | null;
};

type EditProfileDesktopProps = {
  onClose: () => void;
  userData: UserData;
  onSave: (updatedData: UserData) => void;
};

export default function DesktopEditProfile({ onClose, userData, onSave }: EditProfileDesktopProps) {
  const [formData, setFormData] = useState<UserData>(userData);  const [profileImage, setProfileImage] = useState<string>(userData.profilePictureUrl || "/images/user.profile/user.avatar.png");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profilePicture: "Invalid file type. Please upload a JPG, JPEG, or PNG file."
        }));
        return;
      }

      // Validate file size (4MB)
      if (file.size > 4 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePicture: "File size too large. Maximum size is 4MB."
        }));
        return;
      } // Create temporary URL for preview
      setProfileImage(URL.createObjectURL(file));

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/user.information/upload-profile-picture', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload profile picture');
        }

        setProfileImage(data.url);
        // Update the form data with the new profile picture URL
        setFormData(prev => ({
          ...prev,
          profilePictureUrl: data.url
        }));
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        setErrors(prev => ({
          ...prev,
          profilePicture: "Failed to upload profile picture. Please try again."
        }));
      }
    }
  };  const removeProfileImage = async () => {
    setProfileImage("/images/user.profile/user.avatar.png");
    
    try {
      const response = await fetch('/api/user.information/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          profilePictureUrl: null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove profile picture');
      }

      setFormData(prev => ({
        ...prev,
        profilePictureUrl: null
      }));
    } catch (error) {
      console.error('Error removing profile picture:', error);
      setErrors(prev => ({
        ...prev,
        profilePicture: "Failed to remove profile picture. Please try again."
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!formData.username?.trim()) newErrors.username = "Username is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

    if (password && password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (password && confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Include the profile picture URL in the update data
        const dataToUpdate = {
          ...formData,
          // If we have a profile picture URL in the form data, use it, otherwise use null
          profilePictureUrl: formData.profilePictureUrl
        };

        const response = await fetch('/api/user.information/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToUpdate),
        });

        const data = await response.json();

        if (!response.ok) {
          const error = data.error || 'Failed to update profile';
          setErrors(prev => ({
            ...prev,
            submit: error
          }));
          return;
        }

        // Pass the updated data to the onSave callback including the profile picture URL
        onSave(dataToUpdate);
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'An error occurred while saving changes'
        }));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
      <div className="bg-black/50 fixed inset-0" onClick={onClose}></div>
      <div className="relative bg-blue-900 rounded-lg shadow-lg flex min-w-[900px] max-h-[90vh]">
        
        {/* Left Sidebar */}
        <div className="w-[250px] p-4 border-r border-blue-500 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>

          <nav className="space-y-1">
            <button className="w-full py-2 text-blue-300 font-medium text-left cursor-pointer">
              Account
            </button>

            {/* <button className="w-full py-2 text-blue-500 hover:text-blue-600 text-left cursor-pointer">
              Preferences
            </button> */}
            <button className="w-full py-2 text-blue-500 hover:text-blue-600 text-left cursor-pointer">
              Terms of service
            </button>
            <button className="w-full py-2 text-blue-500 hover:text-blue-600 text-left cursor-pointer">
              About
            </button>
          </nav>

          <div className="absolute bottom-0 left-0 right-0">
            <Image
              src="/images/user.profile/butty.waving.left.png"
              alt="Butty mascot"
              width={250}
              height={250}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 relative overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-300">Edit Your Account</h2>
            <button onClick={onClose} className="text-blue-300">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <div className="relative">
                  <div className="h-25 w-25 bg-blue-900 rounded-md flex items-center justify-center overflow-hidden">
                    <Image
                      src={profileImage}
                      alt="User Profile"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm text-blue-300 font-medium mb-2">Picture</h3>
                  <div className="flex space-x-2">
                    <label className="bg-neutral-white text-blue-200 px-4 py-1 rounded-full text-sm hover:bg-blue-600 cursor-pointer">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="bg-neutral-white text-blue-200 px-4 py-1 rounded-full text-sm hover:bg-blue-600 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="bg-neutral-white p-2 rounded-md mt-2">
                    <p className="text-xs text-blue-200 mt-1">
                      Upload a image (at least 98x98px, max 4MB). Make sure your picture
                      follows the Community. Supported formats: JPG, JPEG, PNG
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-blue-200 mb-4">Use your real or preferred name for your profile</p>

            {/* Form Fields in Two Columns */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* First Column */}
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-blue-300'} rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">Error Input here</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-blue-300'} rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">Error Input here</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  Username
                </label>
                <p className="text-xs text-gray-500 mb-1">Unique, includes letters, numbers. No spaces or special characters.</p>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-blue-300'} rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">Error Input here</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  Date of birth
                </label>
                <p className="text-xs text-gray-500 mb-1">Enter your birthdate (MM/DD/YYYY). This will not be shown publicly.</p>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Pick a date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  New Password
                </label>
                <p className="text-xs text-gray-500 mb-1">Minimum of 8 characters with mix of letters, and numbers.</p>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-blue-300'} rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter new password"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">Error Input here</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  Confirm Password
                </label>
                <p className="text-xs text-gray-500 mb-1">Re-enter your new password to confirm it. Must match exactly.</p>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`w-full p-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-blue-300'} rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">Error Input here</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-blue-300'} rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">Error Input here</p>}
              </div>

              <div>
                <label className="block text-sm font-medium  text-blue-300 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Warning text */}
            <p className="text-blue-700 text-sm mt-6 mb-4">Please complete all changed to continue</p>
            {errors.submit && (
              <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 mt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center px-5 py-2 border border-[#521414] text-red-600 rounded-md hover:bg-[#521414] cursor-pointer hover:text-white"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Discard Changes
              </button>
              <button
                type="submit"
                className="flex items-center px-5 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-md"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
