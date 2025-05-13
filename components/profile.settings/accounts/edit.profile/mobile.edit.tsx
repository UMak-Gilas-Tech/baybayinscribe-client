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

type MobileEditProfileProps = {
    onClose: () => void;
    userData: UserData;
    onSave: (updatedData: UserData) => void;
};

export default function MobileEditProfile({ onClose, userData, onSave }: MobileEditProfileProps) {
    const [formData, setFormData] = useState<UserData>(userData);
    const [profileImage, setProfileImage] = useState<string>(userData.profilePictureUrl || "/images/user.profile/user.avatar.png");
    const [errors, setErrors] = useState<Partial<Record<keyof UserData | 'profilePicture', string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is edited
        if (errors[name as keyof UserData]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
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
            }

            // Create temporary URL for preview
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
    };

    const removeProfileImage = async () => {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        const newErrors: Partial<Record<keyof UserData, string>> = {};

        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Create update data that includes all form data, ensuring profile picture URL is included
        const dataToUpdate = {
            ...formData,
            // If we have a profile picture URL in the form data, use it, otherwise use null
            profilePictureUrl: formData.profilePictureUrl
        };

        // Call onSave with the complete update data
        onSave(dataToUpdate);
    };

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg overflow-y-auto max-h-[90vh]">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
                <div className="flex-1 py-3 text-center text-blue-600 font-semibold border-b-2 border-blue-600">
                    <Image
                        src="/images/user.profile/butty.stand.png"
                        alt="Profile Icon"
                        width={30}
                        height={30}
                        className="inline-block mr-2"
                    />
                    Profile
                </div>
                <div className="flex-1 py-3 text-center text-gray-500">
                    <Image
                        src="/images/user.profile/butty.tonguecheek.png"
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
                    <h2 className="text-xl font-semibold text-blue-300">Edit Your Account</h2>
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
                                    <label
                                        className="bg-neutral-white text-blue-200 px-4 py-1 rounded-full text-sm hover:bg-blue-600 cursor-pointer"
                                    >
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
                            <p className="text-red-600 text-xs mt-1">{errors.profilePicture}</p>
                        )}
                    </div>

                    <div className="bg-neutral-white p-4 rounded-md">
                        <p className="text-xs text-blue-200 mt-3">
                            Upload a image (at least 98x98px, max 4MB). Make sure your picture
                            follows the Community. Supported formats: JPG, JPEG, PNG
                        </p>
                    </div>

                    <p className="text-sm text-blue-200">Use your real or preferred name for your profile</p>

                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full p-2 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.firstName && (
                            <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full p-2 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.lastName && (
                            <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
                        )}
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.username && (
                            <p className="text-red-600 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Contact Number</label>
                        <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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