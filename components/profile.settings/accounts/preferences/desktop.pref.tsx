"use client";

import React from 'react';
import Image from 'next/image';
import { X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/lib/auth-client';
import { Switch } from "@/components/ui/switch";

interface DesktopPreferenceProps {
    onClose: () => void;
    onProfileClick?: () => void;
    onShowTerms?: () => void;
    onShowAbout?: () => void;
}

export default function DesktopPreference({ onClose, onProfileClick, onShowTerms, onShowAbout }: DesktopPreferenceProps) {
    const router = useRouter();
    const [soundEffects, setSoundEffects] = React.useState({
        whaleSound: false,
        buttonClicks: false,
        muteAll: false
    });

    const handleSoundToggle = (setting: keyof typeof soundEffects) => {
        setSoundEffects(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/auth/login');
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
            <div className="bg-black/50 fixed inset-0" onClick={onClose}></div>
            <div className="relative bg-blue-900 rounded-lg shadow-lg flex min-w-[850px] max-w-[100vw] max-h-[90vh]">
                {/* Left sidebar */}
                <div className="w-[250px] p-4 border-r border-blue-500 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-6">Settings</h2>

                    <nav className="space-y-1">
                        <button
                            onClick={onProfileClick}
                            className="w-full py-2 text-blue-500 hover:text-blue-600 text-left cursor-pointer"
                        >
                            Account
                        </button>

                        <button className="w-full py-2 text-blue-300 font-medium text-left cursor-pointer">
                            Preferences
                        </button>

                        <button
                            onClick={onShowTerms}
                            className="w-full py-2 text-blue-500 hover:text-blue-600 text-left cursor-pointer"
                        >
                            Terms of service
                        </button>

                        <button
                            onClick={onShowAbout}
                            className="w-full py-2 text-blue-500 hover:text-blue-600 text-left cursor-pointer">
                            About
                        </button>
                    </nav>

                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center text-gray-700 py-2 hover:text-blue-600 cursor-pointer"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Log out
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <Image
                            src="/images/user.profile/butty.waving.left.png"
                            alt="Butty mascot"
                            width={250}
                            height={250}
                        />
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-7 relative overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-blue-300">Preferences</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Language Section */}
                    <div className="mb-8">
                        <label className="block text-blue-300 font-semibold mb-2">Language</label>
                        <select className="w-full bg-neutral-white border border-blue-200 rounded-lg p-2 text-blue-300">
                            <option>System (Default)</option>
                        </select>
                    </div>

                    {/* Sound Effects Section */}
                    <div className="mb-8 mt-16">
                        <h3 className="text-blue-300 font-bold mb-4">Sound Effects</h3>
                        <div className="bg-neutral-white rounded-lg p-4 space-y-4 relative">
                            <div className="flex items-center space-x-3 mb-4">
                                <Switch
                                    checked={soundEffects?.whaleSound}
                                    onCheckedChange={() => handleSoundToggle('whaleSound')}
                                    aria-label="Toggle whale sound"
                                />
                                <span className="text-blue-300">Enable Whale sound on success</span>
                            </div>

                            <div className="flex items-center space-x-3 mb-4">
                                <Switch
                                    checked={soundEffects?.buttonClicks}
                                    onCheckedChange={() => handleSoundToggle('buttonClicks')}
                                    aria-label="Toggle button click sounds"
                                />
                                <span className="text-blue-300">Enable Button Click sounds</span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Switch
                                    checked={soundEffects?.muteAll}
                                    onCheckedChange={() => handleSoundToggle('muteAll')}
                                    aria-label="Toggle mute all sounds"
                                />
                                <span className="text-blue-300">Mute All sounds</span>
                            </div>
                            <Image
                                src="/images/user.profile/butty.stand.png"
                                alt="Butty mascot"
                                width={120}
                                height={60}
                                className="hidden xs:block absolute -top-18 -right-8"
                            />
                        </div>
                    </div>

                    {/* Quiz Difficulty Section */}
                    <div className="mb-8 mt-16">
                        <h3 className="text-blue-300 font-bold mb-4">Quiz Difficulty</h3>
                        <div className="bg-neutral-white rounded-lg p-4 space-y-4">
                            <div className="relative w-full">
                                <label className="flex items-start space-x-3 cursor-pointer mb-4">
                                    <input type="radio" name="difficulty" className="mt-1" />
                                    <div>
                                        <div className="text-blue-300 font-medium">Balanced</div>
                                        <div className="text-grey-300 text-sm">A mix of challenge and review</div>
                                    </div>
                                </label>

                                <label className="flex items-start space-x-3 cursor-pointer mb-4">
                                    <input type="radio" name="difficulty" className="mt-1" />
                                    <div>
                                        <div className="text-blue-300 font-medium">Easy Mode</div>
                                        <div className="text-grey-700 text-sm">Chill, no pressure learning</div>
                                    </div>
                                </label>

                                <label className="flex items-start space-x-3 cursor-pointer mb-4">
                                    <input type="radio" name="difficulty" className="mt-1" />
                                    <div>
                                        <div className="text-blue-300 font-medium">Hardcore Mode</div>
                                        <div className="text-grey-700 text-sm">No hints, timer on</div>
                                    </div>
                                </label>

                                <Image
                                    src="/images/user.profile/butty.thumbsup.png"
                                    alt="Butty mascot"
                                    width={120}
                                    height={70}
                                    className="hidden xs:block absolute -top-20 -right-15"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}