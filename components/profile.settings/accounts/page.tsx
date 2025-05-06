"use client";

import React, { useState } from "react";
import { useMediaQuery } from "../../../hooks/use-media-query";
import ProfileMobile from "./ProfileMobile";
import ProfileDesktop from "./ProfileDesktop";

// Mock user data - replace with actual user data fetching
const mockUser = {
  firstName: "Juan",
  lastName: "Dela Cruz",
  username: "@JuwanDlckruz",
  contactNumber: "09999999999",
  dateOfBirth: "April 12, 2002",
  email: "juandelacruz@gmail.com",
  authProviders: [
    { name: "Google Account", linked: true },
    { name: "Facebook Account", linked: true }
  ]
};

export default function ProfilePage() {
  const [userData] = useState(mockUser);
  // Use lg breakpoint (1024px) instead of md/xs to match the requirement
  const isMobile = useMediaQuery("(max-width: 1023px)");

  if (isMobile) {
    return <ProfileMobile userData={userData} />;
  }

  return <ProfileDesktop userData={userData} />;
} 