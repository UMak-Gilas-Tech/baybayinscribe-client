"use client"

import React, { useState } from "react";
import Image from "next/image";
import { X, Calendar } from "lucide-react";

type UserData = {
    firstName: string;
    lastName: string;
    username: string;
    contactNumber?: string;
    dateOfBirth?: string;
    email: string;
};

type MobileEditProfileProps = {
    onClose: () => void;
    userData: UserData;
    onSave: (updatedData: UserData) => void;
};

export default function MobileEditProfile({ onClose, userData, onSave }: MobileEditProfileProps) {
    const [formData, setFormData] = useState<UserData>(userData);
    const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        const newErrors: Partial<Record<keyof UserData, string>> = {};

        if (!formData.firstName) newErrors.firstName = "Error input here";
        if (!formData.lastName) newErrors.lastName = "Error input here";
        if (!formData.username) newErrors.username = "Error input here";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(formData);
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
                                <div className="text-white">
                                    <Image
                                        src="/images/user.profile/user.avatar.png"
                                        alt="User Profile"
                                        width={64}
                                        height={64}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-700 font-medium mb-2">Picture</div>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        className="bg-neutral-white text-blue-200 px-4 py-1 rounded-full text-sm hover:bg-blue-600 cursor-pointer"
                                    >
                                        Change
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-neutral-white text-blue-200 px-4 py-1 rounded-full text-sm hover:bg-blue-600 cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
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
                        <label className="block text-sm font-medium text-blue-300 mb-1">First Name:</label>
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
                        <label className="block text-sm font-medium text-blue-300 mb-1">Last Name:</label>
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
                        <p className="text-xs text-gray-600 mb-1">Unique, includes letters, numbers. No spaces or special characters.</p>
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

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Date of birth</label>
                        <p className="text-xs text-gray-600 mb-1">Enter your birthdate (MM/DD/YYYY). This will not be shown publicly.</p>
                        <div className="relative">
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth || ""}
                                onChange={handleChange}
                                className="w-full p-2 pl-8 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Calendar className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">New Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your new password"
                            className="w-full p-2 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your new password"
                            className="w-full p-2 border border-blue-200 rounded-md bg-neutral-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </form>

                {/* Buttons */}

                {/* Save Changes Button */}
                <div className="border-t border-gray-200 pt-4 mt-6 space-y-3">
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 cursor-pointer hover:text-white"
                    >
                        Save Changes
                    </button>

                    {/* Discard Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full border-[#521414] text-red-600 py-3 rounded-md font-medium hover:bg-[#521414] cursor-pointer hover:text-white"
                    >
                        Discard Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
