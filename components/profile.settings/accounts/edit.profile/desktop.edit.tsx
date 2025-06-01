"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Eye, EyeClosed } from "lucide-react";
import {
  createPasswordSchema,
  checkPasswordStrength,
  PasswordStrength,
} from "@/lib/auth/passwordValidation";
import { authClient } from "../../../../app/lib/auth-client";

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  contactNumber?: string;
  dateOfBirth?: string;
  email: string;
  profilePictureUrl?: string | null;
};

type FormDataWithFile = Omit<UserData, "profilePictureUrl"> & {
  profilePictureUrl?: string | File | null;
  profilePicture?: File | null;
};

type EditProfileDesktopProps = {
  onClose: () => void;
  userData: UserData;
  onSave: (updatedData: UserData) => void;
};

export default function DesktopEditProfile({
  onClose,
  userData,
  onSave,
}: EditProfileDesktopProps) {
  const [formData, setFormData] = useState<FormDataWithFile>(
    userData as FormDataWithFile
  );
  const [profileImage, setProfileImage] = useState<string>(
    userData.profilePictureUrl || "/images/user.profile/user.avatar.webp"
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Get strength color
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

  // Update internal state when userData prop changes
  useEffect(() => {
    setFormData(userData as FormDataWithFile);
    setProfileImage(
      userData.profilePictureUrl || "/images/user.profile/user.avatar.webp"
    );
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPassword(e.target.value);
    if (errors.currentPassword) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.currentPassword;
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(
      newPassword ? checkPasswordStrength(newPassword) : null
    );

    if (errors.password) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => {
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

      // Create temporary URL for preview and update local state immediately
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);

      // Update form data with the file object for later upload on save
      setFormData((prev) => ({
        ...prev,
        profilePicture: file, // Store the file object itself temporarily
        profilePictureUrl: previewUrl, // Store the preview URL temporarily
      }));

      // Clear any previous profile picture errors
      if (errors.profilePicture) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.profilePicture;
          return newErrors;
        });
      }

      // Do NOT call onSave here, wait for the main submit button
    }
  };

  const removeProfileImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default button behavior
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
        // Continue with state updates even if blob deletion fails
      }

      // Update local state only - don't save to database yet
      const updatedFormData = {
        ...formData,
        profilePicture: null, // Clear the file object as well
        profilePictureUrl: null,
      };

      // Update both form data and profile image state
      setFormData(updatedFormData);
      setProfileImage("/images/user.profile/user.avatar.webp");

      // Do NOT call onSave here, wait for the main submit button
    } catch (error) {
      console.error("Error removing profile picture:", error);
      setErrors((prev) => ({
        ...prev,
        profilePicture: "Failed to remove profile picture. Please try again.",
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim())
      newErrors.lastName = "Last name is required";
    if (!formData.username?.trim()) newErrors.username = "Username is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    // Password validation using the same schema as registration
    if (password || confirmPassword || currentPassword) {
      if (!currentPassword)
        newErrors.currentPassword =
          "Current password is required to change password";

      const passwordSchema = createPasswordSchema();
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "New passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        let finalProfilePictureUrl = formData.profilePictureUrl;

        // If a new file was selected, upload it first
        if (
          formData.profilePicture &&
          formData.profilePicture instanceof File
        ) {
          const fileFormData = new FormData();
          fileFormData.append("file", formData.profilePicture);

          const uploadResponse = await fetch(
            "/api/user.information/upload-profile-picture",
            {
              method: "POST",
              body: fileFormData,
            }
          );

          const uploadData = await uploadResponse.json();

          if (!uploadResponse.ok) {
            throw new Error(
              uploadData.error || "Failed to upload new profile picture"
            );
          }
          finalProfilePictureUrl = uploadData.url;
        }

        // Prepare the data to update user information in the database
        const dataToUpdate: UserData = {
          ...formData,
          profilePictureUrl:
            typeof finalProfilePictureUrl === "string"
              ? finalProfilePictureUrl
              : null,
        };

        // If password is being updated, use authClient.changePassword
        if (password && currentPassword) {
          const changePasswordResponse = await authClient.changePassword({
            currentPassword: currentPassword,
            newPassword: password,
          });

          if (changePasswordResponse?.error) {
            // Check if the error message specifically indicates an incorrect current password
            const errorMessage =
              changePasswordResponse.error.message ||
              "Failed to change password";
            // Let's try a more robust check, perhaps based on error code or a clearer message pattern if available.
            // For now, let's be slightly less strict with the includes to see if we catch it.
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
        const response = await fetch("/api/user.information/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToUpdate),
        });

        const responseData = await response.json();

        if (!response.ok) {
          const error =
            responseData.error ||
            (await response.text()) ||
            "Failed to update profile";
          setErrors((prev) => ({
            ...prev,
            submit: error,
          }));
          return;
        }

        // Pass the updated data to the onSave callback
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
              src="/images/user.profile/butty.waving.left.webp"
              alt="Butty mascot"
              width={250}
              height={250}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 relative overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-300">
              Edit Your Account
            </h2>
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
                    {profileImage ? (
                      <Image
                        key={profileImage}
                        src={profileImage}
                        alt="User Profile"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <Image
                        key="default-avatar"
                        src="/images/user.profile/user.avatar.webp"
                        alt="Default Profile"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm text-blue-300 font-medium mb-2">
                    Picture
                  </h3>
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
                      Upload a image (at least 98x98px, max 4MB). Make sure your
                      picture follows the Community. Supported formats: JPG,
                      JPEG, webp
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-blue-200 mb-4">
              Use your real or preferred name for your profile
            </p>

            {/* Form Fields in Two Columns */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* First Row */}
              <div className="flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    First Name
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-1">
                    Update your first name.
                  </p>
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.firstName ? "border-red-500" : "border-blue-300"
                  } rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Last Name
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-1">
                    Update your last name.
                  </p>
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.lastName ? "border-red-500" : "border-blue-300"
                  } rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Second Row */}
              <div className="flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Username
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-1">
                    Unique, includes letters, numbers. No spaces or special
                    characters.
                  </p>
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.username ? "border-red-500" : "border-blue-300"
                  } rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div className="flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Date of birth
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-1">
                    Enter your birthdate (MM/DD/YYYY). This will not be shown
                    publicly.
                  </p>
                </div>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                  placeholder="Pick a date"
                />
              </div>

              {/* Third Row (Password Fields) */}
              <div className="flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Current Password
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-1">
                    Enter your current password to change it.
                  </p>
                </div>
                <div className="relative mt-1">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    className={`w-full p-2 border ${
                      errors.currentPassword
                        ? "border-red-500"
                        : "border-blue-300"
                    } rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
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
                  <p className="text-red-500 text-xs mt-1 bg-red-100 p-1 rounded">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    New Password
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-1">
                    Min 8 chars, mix of letters, numbers, and symbols.
                  </p>
                </div>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className={`w-full p-2 border ${
                      errors.password ? "border-red-500" : "border-blue-300"
                    } rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    onKeyDown={(e) =>
                      handleKeyDown(e, togglePasswordVisibility)
                    }
                    className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md p-1"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                    className={`text-sm ${getStrengthColor(
                      passwordStrength
                    )} mt-1`}
                  >
                    Password Strength: {passwordStrength}
                  </p>
                )}
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Fourth Row (Confirm Password and Email) */}
              <div className="flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Confirm Password
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-1">
                    Re-enter your new password.
                  </p>
                </div>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`w-full p-2 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-blue-300"
                    } rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Email
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-1">
                    Update your email address.
                  </p>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.email ? "border-red-500" : "border-blue-300"
                  } rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Fifth Row (Contact Number) */}
              <div className="flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">
                    Contact Number
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-1">
                    Update your contact number.
                  </p>
                </div>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded-md bg-neutral-white focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                />
              </div>
            </div>

            {/* Warning text */}
            <p className="text-blue-700 text-sm mt-6 mb-4">
              Feel free to change your information here!
            </p>
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
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H5H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Discard Changes
              </button>
              <button
                type="submit"
                className="flex items-center px-5 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 21V13H7V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 3V8H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
