"use client"

import React from 'react';
import { MobileTerms } from './terms/mobile.terms';
import { MobileAbout } from './about/mobile.about';

interface MobileSettingsProps {
  onSignOut: () => void;
  isVisible: boolean;
  onClose: () => void;
  onProfileClick?: () => void;
  onShowTerms?: () => void;
}

export default function MobileSettings({ onSignOut, isVisible, onClose, onProfileClick }: MobileSettingsProps) {
  const [showTerms, setShowTerms] = React.useState(false);
  const [showAbout, setShowAbout] = React.useState(false);

  if (!isVisible) return null;

  const handleTermsShow = () => {
    setShowTerms(true);
    // Don't close settings here, let Terms component handle its own state
  };

  const handleAboutShow = () => {
    setShowAbout(true);
    // Don't close settings here, let Terms component handle its own state
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20"
        onClick={onClose}
      >
        <div
          className="absolute bottom-0 left-0 right-0 bg-neutral-white rounded-t-lg shadow-lg"
          onClick={e => e.stopPropagation()}
        >
          {/* Close line indicator */}
          <div
            className="w-full h-1 flex justify-center items-center py-4 cursor-pointer"
            onClick={onClose}
          >
            <div className="w-12 h-1 bg-blue-400 rounded-full" />
          </div>

          <div className="px-4 pb-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-semibold text-blue-400">Settings</h3>
            </div>            <div className="space-y-1 flex flex-col items-center">
              <button 
                className="w-full text-center py-3 text-blue-300 hover:text-blue-400 cursor-pointer"
                onClick={handleAboutShow}
              >
                About
              </button>
              <button
                className="w-full text-center py-3 text-blue-300 hover:text-blue-400 cursor-pointer"
                onClick={handleTermsShow}
              >
                Terms of service
              </button>

              <button className="w-full text-center py-3 text-blue-300 hover:text-blue-400 cursor-pointer">
                Preferences
              </button>

              <button
                onClick={onSignOut}
                className="w-full text-center py-3 text-red-500 hover:text-red-600 cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
        {showTerms && (
        <MobileTerms
          onClose={() => {
            setShowTerms(false);
            onClose(); // Close settings when Terms is closed
          }}
          onProfileClick={() => {
            setShowTerms(false);
            onClose();
            if (onProfileClick) {
              onProfileClick();
            }
          }}
        />
      )}

      {showAbout && (
        <MobileAbout
          onClose={() => {
            setShowAbout(false);
            onClose(); // Close settings when Terms is closed
          }}
          onProfileClick={() => {
            setShowAbout(false);
            onClose();
            if (onProfileClick) {
              onProfileClick();
            }
          }}
        />
      )}
    </>
  );
}
