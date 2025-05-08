"use client";

import React, { useState } from "react";
import ProfileModal from "@/components/profile.settings/accounts/ModalProf";
import { useRouter } from "next/navigation";

// Mock user data - you should replace this with real data fetching
const mockUserData = {
  firstName: "Juan",
  lastName: "Dela Cruz",
  username: "@JuanDelaCruz",
  contactNumber: "09999999999", 
  dateOfBirth: "01/15/1990",
  email: "juan@example.com",
  authProviders: [
    { name: "Google", linked: true },
    { name: "Facebook", linked: true }
  ]
};

export default function ProfilePage() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [userData] = useState(mockUserData);

  const handleClose = () => {
    setIsOpen(false);
    // Navigate away when modal is closed
    router.push('/');
  };

  return (
    <ProfileModal
      userData={userData}
      onClose={handleClose}
      isOpen={isOpen}
    />
  );
} 