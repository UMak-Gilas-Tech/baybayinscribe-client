"use client";

import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import ProfileModalMobile from "./Mobile.Profile";
import ProfileModalDesktop from "./Desktop.Profile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden for accessibility

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

  if (!isOpen) return null;

  // Convert provider string to authProviders array if needed
  const enhancedUserData = {
    ...userData,
    authProviders: userData.authProviders || (
      userData.provider ? [{ name: userData.provider, linked: true }] : []
    ),
  };

  const ModalContent = isMobile
    ? <ProfileModalMobile userData={enhancedUserData} onClose={onClose} />
    : <ProfileModalDesktop userData={enhancedUserData} onClose={onClose} />;

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
        {ModalContent}
      </DialogContent>
    </Dialog>
  );
}