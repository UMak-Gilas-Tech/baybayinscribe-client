"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import ProfileModalMobile from "./mobile.profile";
import ProfileModalDesktop from "./desktop.profile";
import DesktopTerms from "./terms/desktop.terms";
import DesktopAbout from "./about/desktop.about";
import DesktopPreference from "./preferences/desktop.pref";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; 
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
  provider?: string; 
  profilePictureUrl?: string | null;
};

type ProfileModalProps = {
  userData: UserData;
  onClose: () => void;
  isOpen: boolean;
  onProfileUpdated?: () => void;
};

export default function ProfileModal({ userData: initialUserData, onClose, isOpen, onProfileUpdated }: ProfileModalProps) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [isEditing, setIsEditing] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [localUserData, setLocalUserData] = useState(initialUserData);

  // Update local state when initialUserData changes
  useEffect(() => {
    setLocalUserData(initialUserData);
  }, [initialUserData]);

  // Reset states when modal is opened
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
      setShowTerms(false);
      setShowAbout(false);
      setShowPreferences(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Convert provider string to authProviders array if needed
  const enhancedUserData = {
    ...localUserData,
    authProviders: localUserData.authProviders || (
      localUserData.provider ? [{ name: localUserData.provider, linked: true }] : []
    ),
  };

  // Handler for saving profile
  const handleSaveProfile = async (updatedData: UserData) => {
    try {
      // Prepare the data for update, keeping existing profilePictureUrl if not changed
      const dataToUpdate = {
        ...updatedData,
        profilePictureUrl: updatedData.profilePictureUrl ?? localUserData.profilePictureUrl
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

      // Get the updated user data from the response
      const updatedUserData = await response.json();

      const enhancedUpdatedData = {
        ...updatedUserData,
        profilePictureUrl: updatedUserData.profilePictureUrl || localUserData.profilePictureUrl,
        authProviders: updatedUserData.authProviders || []
      };

      // Update local state and close edit mode
      setLocalUserData(enhancedUpdatedData);
      setIsEditing(false);
      if (onProfileUpdated) {
        onProfileUpdated();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Choose the content based on states and device type
  let modalContent;   if (showTerms) {
    modalContent = (
      <DesktopTerms
        onClose={onClose}
        onProfileClick={() => setShowTerms(false)}
        onShowAbout={() => {
          setShowTerms(false);
          setShowAbout(true);
        }}
        onShowPreferences={() => {
          setShowTerms(false);
          setShowPreferences(true);
        }}
      />
    );
  }
  else if (showAbout) {
    modalContent = (
      <DesktopAbout
        onClose={onClose}
        onProfileClick={() => setShowAbout(false)}
        onShowTerms={() => {
          setShowAbout(false);
          setShowTerms(true);
        }}
        onShowPreferences={() => {
          setShowAbout(false);
          setShowPreferences(true);
        }}
      />
    );
  }
  else if (showPreferences) {
    modalContent = (
      <DesktopPreference
        onClose={onClose}
        onProfileClick={() => setShowPreferences(false)}
        onShowTerms={() => {
          setShowPreferences(false);
          setShowTerms(true);
        }}
        onShowAbout={() => {
          setShowPreferences(false);
          setShowAbout(true);
        }}
      />
    );
  } else if (isEditing && isMobile) {
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
        onEdit={() => setIsEditing(true)}
      />
    );
  } else {
    modalContent = (
      <ProfileModalDesktop
        userData={enhancedUserData}
        onClose={onClose}
        onEdit={() => setIsEditing(true)}
        onShowTerms={() => setShowTerms(true)}
        onShowAbout={() => setShowAbout(true)}
        onShowPreferences={() => setShowPreferences(true)}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="p-0 border-none max-w-4xl bg-transparent shadow-none"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle>
          <VisuallyHidden>
            {showTerms ? "Terms of Service" : "Edit Profile"}
            {showAbout ? "About us" : "Edit Profile"}
            {showPreferences ? "Preferences" : "Edit Profile"}
          </VisuallyHidden>
        </DialogTitle>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}