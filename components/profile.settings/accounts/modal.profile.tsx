"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import ProfileModalMobile from "./mobile.profile";
import ProfileModalDesktop from "./desktop.profile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden for accessibility
import MobileEditProfile from "./edit.profile/mobile.edit";
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
  provider?: string; // For compatibility with existing code
};

type ProfileModalProps = {
  userData: UserData;
  onClose: () => void;
  isOpen: boolean;
};

export default function ProfileModal({ userData, onClose, isOpen }: ProfileModalProps) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [isEditing, setIsEditing] = useState(false);
  
  // Reset editing state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Convert provider string to authProviders array if needed
  const enhancedUserData = {
    ...userData,
    authProviders: userData.authProviders || (
      userData.provider ? [{ name: userData.provider, linked: true }] : []
    ),
  };
  
  // Handler for saving profile
  const handleSaveProfile = async (updatedData: UserData) => {
    // TODO: Implement API call to update user data
    console.log('Updated user data:', updatedData);
    setIsEditing(false);
  };
  
  // Choose the content based on edit mode and device type
  let modalContent;
  if (isEditing && isMobile) {
    modalContent = (
      <MobileEditProfile
        onClose={() => setIsEditing(false)}
        userData={enhancedUserData}
        onSave={handleSaveProfile}
      />
    );
  } else if (isEditing && !isMobile) {
    modalContent = (
      <DesktopEditProfile
        onClose={() => setIsEditing(false)}
        userData={enhancedUserData}
        onSave={handleSaveProfile}
      />
    );
  } else if (isMobile) {
    modalContent = (
      <ProfileModalMobile 
        userData={enhancedUserData} 
        onClose={onClose}
        onEdit={() => setIsEditing(true)}
      />
    );
  } else {
    modalContent = (
      <ProfileModalDesktop 
        userData={enhancedUserData} 
        onClose={onClose} 
        onEdit={() => setIsEditing(true)}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="p-0 border-none max-w-4xl bg-transparent shadow-none"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Add DialogTitle for accessibility */}
        <DialogTitle>
          <VisuallyHidden>Edit Profile</VisuallyHidden>
        </DialogTitle>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}