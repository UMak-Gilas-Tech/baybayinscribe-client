"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Eye, EyeClosed } from "lucide-react";
import {
  createPasswordSchema,
  checkPasswordStrength,
  PasswordStrength,
} from "@/lib/auth/passwordValidation";
import { authClient } from "../../../../app/lib/auth-client"; // Import authClient

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  contactNumber?: string;
  dateOfBirth?: string;
  email: string;
  profilePictureUrl?: string | null;
};

type MobileEditProfileProps = {
  onClose: () => void;
  userData: UserData;
  onSave: (updatedData: UserData) => void;
};

export default function MobileEditProfile({
  onClose,
  userData,
  onSave,
}: MobileEditProfileProps) {
  const [formData, setFormData] = useState<UserData>(userData);
  const [profileImage, setProfileImage] = useState<string>(
    userData.profilePictureUrl || "/images/user.profile/user.avatar.webp"
  );
  const [currentPassword, setCurrentPassword] = useState(""); // Add state for current password
  const [password, setPassword] = useState(""); // Add state for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // Add state for confirm password
  const [errors, setErrors] = useState<
    Partial<
      Record<
        | keyof UserData
        | "profilePicture"
        | "currentPassword"
        | "password"
        | "confirmPassword",
        string
      >
    >
  >({});
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength | null>(null); // Add state for password strength
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Add state for current password visibility
  const [showPassword, setShowPassword] = useState(false); // Add state for new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Add state for confirm password visibility

  // Update internal state when userData prop changes
  useEffect(() => {
    setFormData(userData);
    setProfileImage(
      userData.profilePictureUrl || "/images/user.profile/user.avatar.webp"
    );
    // Reset password related states when user data changes
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.currentPassword;
      delete newErrors.password;
      delete newErrors.confirmPassword;
      return newErrors;
    });
    setPasswordStrength(null);
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof UserData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPassword(e.target.value);
    if (errors.currentPassword) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: "",
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(
      newPassword ? checkPasswordStrength(newPassword) : null
    );
    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent, toggleFn: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFn();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!["image/jpeg", "image/webp", "image/jpg"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          profilePicture:
            "Invalid file type. Please upload a JPG, JPEG, or webp file.",
        }));
        return;
      }

      // Validate file size (4MB)
      if (file.size > 4 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: "File size too large. Maximum size is 4MB.",
        }));
        return;
      }

      // Create temporary URL for preview
      setProfileImage(URL.createObjectURL(file));

      try {
        const fileFormData = new FormData();
        fileFormData.append("file", file);

        const response = await fetch(
          "/api/user.information/upload-profile-picture",
          {
            method: "POST",
            body: fileFormData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload profile picture");
        }

        setProfileImage(data.url);
        // Update the form data state with the new profile picture URL
        const updatedFormData = {
          ...formData,
          profilePictureUrl: data.url,
        };
        setFormData(updatedFormData);

        // Call onSave with the complete updated data to immediately update the parent component
        onSave({
          ...userData,
          ...updatedFormData,
        });
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        setErrors((prev) => ({
          ...prev,
          profilePicture: "Failed to upload profile picture. Please try again.",
        }));
      }
    }
  };

  const removeProfileImage = async () => {
    setProfileImage("/images/user.profile/user.avatar.webp");

    try {
      // Call backend API to delete profile picture from blob storage
      const deleteResponse = await fetch(
        "/api/user.information/delete-profile-picture",
        {
          method: "DELETE",
        }
      );

      if (!deleteResponse.ok) {
        // Log the error but don't block the profile update if blob deletion fails
        console.error(
          "Failed to delete profile picture from blob storage",
          await deleteResponse.text()
        );
      }

      // Update user information in database with null profile picture URL
      const response = await fetch("/api/user.information/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          profilePictureUrl: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove profile picture");
      }

      setFormData((prev) => ({
        ...prev,
        profilePictureUrl: null, // The backend will handle setting this to null in the DB
      }));

      // Update local state and inform parent
      const updatedFormData = {
        ...formData,
        profilePictureUrl: null, // Set to null in modal state
      };
      setFormData(updatedFormData);
      setProfileImage("/images/user.profile/user.avatar.webp"); // Update modal's preview image

      // Call onSave with the complete updated data including null profilePictureUrl
      onSave({
        ...userData, // Start with original user data
        ...updatedFormData, // Overlay with current form data (now with profilePictureUrl: null)
      });
    } catch (error) {
      console.error("Error removing profile picture:", error);
      setErrors((prev) => ({
        ...prev,
        profilePicture: "Failed to remove profile picture. Please try again.",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: Partial<
      Record<
        | keyof UserData
        | "profilePicture"
        | "currentPassword"
        | "password"
        | "confirmPassword",
        string
      >
    > = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    // Password validation using the same schema as registration
    if (password || confirmPassword || currentPassword) {
      // Validate password fields if any are filled
      if (!currentPassword)
        newErrors.currentPassword =
          "Current password is required to change password";

      const passwordSchema = createPasswordSchema();
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password"; // Changed message for clarity
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "New passwords do not match"; // Changed message for clarity
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Create update data that includes all form data, ensuring profile picture URL is included
      const dataToUpdate = {
        ...formData,
        // If we have a profile picture URL in the form data, use it, otherwise use null
        profilePictureUrl: formData.profilePictureUrl,
      };

      // If password is being updated, use authClient.changePassword
      if (password && currentPassword) {
        // Check if both new and current password are provided
        const changePasswordResponse = await authClient.changePassword({
          currentPassword: currentPassword,
          newPassword: password,
        });

        if (changePasswordResponse?.error) {
          // Check if the error message specifically indicates an incorrect current password
          const errorMessage =
            changePasswordResponse.error.message || "Failed to change password";
          // Let's use the same broader check as in the desktop version
          if (
            errorMessage.toLowerCase().includes("password") &&
            (errorMessage.toLowerCase().includes("incorrect") ||
              errorMessage.toLowerCase().includes("invalid"))
          ) {
            setErrors((prev) => ({
              ...prev,
              currentPassword:
                "Current password is incorrect. Please try again.",
            }));
            return; // Stop the submission process if current password is wrong
          } else {
            // If it's a different error, throw it to be caught by the generic handler
            throw new Error(errorMessage);
          }
        }

        // Clear password fields after successful update
        setCurrentPassword("");
        setPassword("");
        setConfirmPassword("");
      }

      // Update other user information (excluding password fields)
      // We only call the update API if there are changes beyond password or if password wasn't changed alone
      if (
        !password ||
        Object.keys(dataToUpdate).some(
          (key) =>
            dataToUpdate[key as keyof UserData] !==
            (userData as UserData)[key as keyof UserData]
        )
      ) {
        const response = await fetch("/api/user.information/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToUpdate),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.error ||
              responseData.message ||
              "Failed to update profile"
          );
        }
      }

      // Call onSave with the complete update data
      onSave(dataToUpdate);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors((prev) => ({
        ...prev,
        submit:
          error instanceof Error
            ? error.message
            : "An error occurred while saving changes",
      }));
    }
  };

  // Get strength color (copied from desktop.edit.tsx)
  const getStrengthColor = (strength: PasswordStrength | null) => {
    switch (strength) {
      case PasswordStrength.STRONG:
        return "text-green-500";
      case PasswordStrength.MEDIUM:
        return "text-yellow-500";
      case PasswordStrength.WEAK:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-blue-900 rounded-lg overflow-y-auto max-h-[90vh]">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <div className="flex-1 py-3 text-center text-blue-600 font-semibold border-b-2 border-blue-600">
          <Image
            src="/images/user.profile/butty.stand.webp"
            alt="Profile Icon"
            width={30}
            height={30}
            className="inline-block mr-2"
          />
          Profile
        </div>
        <div className="flex-1 py-3 text-center text-gray-500">
          <Image
            src="/images/user.profile/butty.tonguecheek.webp"
            alt="Settings Icon"
            width={25}
            height={25}
            className="inline-block mr-2"
          />
          Settings
        </div>
      </div>

      <div className="p-4 pb-20 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-300">
            Edit Your Account
          </h2>
          <button onClick={onClose} className="text-blue-900">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Picture Section */}
          <div className="p-2">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-blue-900 rounded-md flex items-center justify-center mr-4">
                <div className="w-full h-full overflow-hidden">
                  <Image
                    src={profileImage}
                    alt="User Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div>
                <div className="text-gray-700 font-medium mb-2">Picture</div>
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
              </div>
            </div>
            {errors.profilePicture && (
              <p className="text-red-600 text-xs mt-1">
                {errors.profilePicture}
              </p>
            )}
          </div>

          <div className="bg-neutral-white p-4 rounded-md">
            <p className="text-xs text-blue-200 mt-3">
              Upload a image (at least 98x98px, max 4MB). Make sure your picture
              follows the Community. Supported formats: JPG, JPEG, webp
            </p>
          </div>

          <p className="text-sm text-blue-200">
            Use your real or preferred name for your profile
          </p>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              First Name
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-1">
              Update your first name.
            </p>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.firstName ? "border-red-500" : "border-blue-200"
              } rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1`}
            />
            {errors.firstName && (
              <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Last Name
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-1">
              Update your last name.
            </p>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.lastName ? "border-red-500" : "border-blue-200"
              } rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1`}
            />
            {errors.lastName && (
              <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Username
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-1">
              Unique, includes letters, numbers. No spaces or special
              characters.
            </p>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.username ? "border-red-500" : "border-blue-200"
              } rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1`}
            />
            {errors.username && (
              <p className="text-red-600 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Current Password
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-1">
              Enter your current password to change it.
            </p>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                className={`w-full p-2 border ${
                  errors.currentPassword ? "border-red-500" : "border-blue-200"
                } rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={toggleCurrentPasswordVisibility}
                onKeyDown={(e) =>
                  handleKeyDown(e, toggleCurrentPasswordVisibility)
                }
                className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md p-1"
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showCurrentPassword ? (
                  <EyeClosed className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-600 text-xs mt-1 bg-red-100 p-1 rounded">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              New Password
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-1">
              Min 8 chars, mix of letters, numbers, and symbols.
            </p>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                className={`w-full p-2 border ${
                  errors.password ? "border-red-500" : "border-blue-200"
                } rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                onKeyDown={(e) => handleKeyDown(e, togglePasswordVisibility)}
                className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeClosed className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordStrength && (
              <p
                className={`text-sm ${getStrengthColor(passwordStrength)} mt-1`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Confirm Password
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-1">
              Re-enter your new password.
            </p>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full p-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-blue-200"
                } rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                onKeyDown={(e) =>
                  handleKeyDown(e, toggleConfirmPasswordVisibility)
                }
                className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md p-1"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeClosed className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Email
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-1">
              Update your email address.
            </p>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.email ? "border-red-500" : "border-blue-200"
              } rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Contact Number
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-1">
              Update your contact number.
            </p>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber || ""}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
            />
            {errors.contactNumber && (
              <p className="text-red-600 text-xs mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Date of Birth
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-1">
              Enter your birthdate (MM/DD/YYYY). This will not be shown
              publicly.
            </p>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ""}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
            />
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-4 mt-6 space-y-3">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 cursor-pointer"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full border-[#521414] bg-gray-200 text-red-600 py-3 rounded-md font-medium hover:bg-[#521414] cursor-pointer hover:text-white"
            >
              Discard Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
