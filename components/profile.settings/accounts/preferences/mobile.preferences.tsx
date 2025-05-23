import React from 'react';
import Image from 'next/image';
import { X } from "lucide-react";
import MobileSettings from '../mobile.settings';
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { Switch } from "@/components/ui/switch";

interface MobilePreferenceProps {
    onClose: () => void;
    onProfileClick?: () => void;
}

export const MobilePreference: React.FC<MobilePreferenceProps> = ({ onClose, onProfileClick }) => {
    const router = useRouter();
    const [isSettingsVisible, setIsSettingsVisible] = React.useState(false);
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
        <div className="fixed inset-0 bg-blue-900 z-50 overflow-y-auto">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-gray-200">
                <div className="flex w-full">
                    <button
                        onClick={onProfileClick}
                        className="flex-1 py-3 text-center font-semibold cursor-pointer text-gray-500"
                    >
                        <Image
                            src="/images/user.profile/butty.stand.png"
                            alt="Profile Icon"
                            width={40}
                            height={40}
                            className="inline-block mr-2"
                        />
                        Profile
                    </button>

                    <button
                        onClick={() => setIsSettingsVisible(true)}
                        className="flex-1 py-3 text-center font-semibold cursor-pointer text-blue-600 border-b-2 border-blue-600"
                    >
                        <Image
                            src="/images/user.profile/butty.tonguecheek.png"
                            alt="Settings Icon"
                            width={30}
                            height={30}
                            className="inline-block mr-2"
                        />
                        Settings
                    </button>
                </div>
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
                    <X size={20} />
                </button>
            </div>

            <div className="p-6">
                <h2 className="text-xl font-bold text-blue-300 mb-6">Preferences</h2>

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
                                checked={soundEffects.whaleSound}
                                onCheckedChange={() => handleSoundToggle('whaleSound')}
                                aria-label="Toggle whale sound"
                            />
                            <span className="text-blue-300">Enable Whale sound on success</span>
                        </div>

                        <div className="flex items-center space-x-3 mb-4">
                            <Switch 
                                checked={soundEffects.buttonClicks}
                                onCheckedChange={() => handleSoundToggle('buttonClicks')}
                                aria-label="Toggle button click sounds"
                            />
                            <span className="text-blue-300">Enable Button Click sounds</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Switch 
                                checked={soundEffects.muteAll}
                                onCheckedChange={() => handleSoundToggle('muteAll')}
                                aria-label="Toggle mute all sounds"
                            />
                            <span className="text-blue-300">Mute All sounds</span>
                        </div>
                            <Image
                                src="/images/user.profile/butty.stand.png"
                                alt="Butty mascot"
                                width={100}
                                height={70}
                                className="hidden xs:block absolute -top-16 -right-6"
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
                                className="hidden xs:block absolute -top-20 -right-14"
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* Settings Overlay */}
            < MobileSettings
                isVisible={isSettingsVisible}
                onClose={() => setIsSettingsVisible(false)}
                onSignOut={handleSignOut}
            />
        </div>
    );
};

export default MobilePreference;
