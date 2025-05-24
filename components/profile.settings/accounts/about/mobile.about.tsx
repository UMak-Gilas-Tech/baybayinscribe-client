import React, { useState } from 'react';
import Image from 'next/image';
import { X } from "lucide-react";
import MobileSettings from '../mobile.settings';
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

interface MobileAboutProps {
    onClose: () => void;
    onProfileClick?: () => void;
}

export const MobileAbout: React.FC<MobileAboutProps> = ({ onClose }) => {
    const router = useRouter();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/auth/login');
                }
            }
        });
    };
    const handleProfileClick = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-blue-900 z-50 overflow-y-auto">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-gray-200">
                <div className="flex w-full">
                    <button
                        onClick={handleProfileClick}
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

            <div className="p-4 space-y-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Image
                            src="/images/BaybayInscribe-AppIcon.png"
                            alt="BaybayInscribe Icon"
                            width={40}
                            height={40}
                        />
                        <h2 className="text-xl text-blue-300 font-bold">About BaybayInscribe</h2>
                    </div>
                    <p className="text-sm text-blue-300 font-medium mt-2">
                        We aim to revive the Baybayin scriptby combining tech and tradition making learning our native script accessible, fun, and meaningful.
                    </p>
                </div>

                {/* Meet the Butty Whale Section */}
                <div className="mb-4 mt-16">
                    <h3 className="mb-2 text-blue-300 font-bold">Meet the Butty Whale</h3>
                    <div className="bg-neutral-white rounded-lg p-4 relative">
                        <div className="relative w-full">
                            <p className="text-sm text-blue-300 font-semibold w-[100%]">
                                Butty is your friendly whale mascot, guiding you through the BaybayInscribe experience.
                                With a playful spirit and a love for learning, Butty is here to make your journey enjoyable
                                and engaging.
                            </p>
                            <Image
                                src="/images/user.profile/butty.stand.png"
                                alt="Butty mascot"
                                width={100}
                                height={70}
                                className="hidden xs:block absolute -top-20 -right-6"
                            />
                        </div>
                    </div>
                </div>

                {/* Meet the Developers */}
                <div>
                    <h3 className="text-lg font-bold text-blue-300 mb-2">👨‍💻 Meet the Developers</h3>
                    <div className="bg-neutral-white rounded-lg p-4 relative">
                        <div className="relative w-full">
                            <p className="text-sm text-blue-300 font-medium mb-4">
                                A dynamic team united by the mission to revive Baybayin through interactive learning
                                and cultural tech.
                            </p>
                        </div>
                    </div>


                    <div className="space-y-4 mt-12">

                        {/* VILLAROSA */}
                        <div className="mb-4">
                            <h3 className="mb-2 font-bold">
                                <span className="text-blue-700">🧠⚙️ Villarosa</span>
                                <span className="text-blue-300">, Jam Emmanuel</span>
                            </h3>
                            <div className="bg-neutral-white rounded-lg p-4 relative">
                                <div className="relative w-full">
                                    <p className="text-sm font-bold text-blue-300">Project Director, Full-Stack Engineer & AI Architect</p>
                                    <p className="text-sm text-blue-300 font-medium mt-1">
                                        Led the system architecture, team coordination, and developed the AI-backed features.
                                    </p>
                                    <Image
                                        src="/images/user.profile/butty.coder.png"
                                        alt="Butty mascot"
                                        width={80}
                                        height={70}
                                        className="hidden xs:block absolute -top-16 -right-7"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* VILLENA */}
                        <div className="mb-4 mt-8">
                            <h3 className="font-bold mb-2">
                                <span className="text-blue-700">🔧💻 Villena</span>
                                <span className="text-blue-300">, Lans Clarence S.</span>
                            </h3>
                            <div className="bg-neutral-white rounded-lg p-4 relative">
                                <div className="relative w-full">
                                    <p className="text-sm font-bold text-blue-300">Senior Full-Stack Developer</p>
                                    <p className="text-sm text-blue-300 font-medium mt-1">
                                        Engineered robust backend and frontend features for smooth and scalable performance.
                                    </p>
                                    <Image
                                        src="/images/user.profile/butty.coder.png"
                                        alt="Butty mascot"
                                        width={80}
                                        height={70}
                                        className="hidden xs:block absolute -top-16 -right-7"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SIAZON */}
                        <div className="mb-4 mt-8">
                            <h3 className="font-bold mb-2">
                                <span className="text-blue-700">🖌️💻 Siazon</span>
                                <span className="text-blue-300">, Mark Angelo D.</span>
                            </h3>
                            <div className="bg-neutral-white rounded-lg p-4 relative">
                                <div className="relative w-full">
                                    <p className="text-sm font-bold text-blue-300">Lead UI/UX Designer & Associate Front-End Developer</p>
                                    <p className="text-sm text-blue-300 font-medium mt-1">
                                        Designed user-defining gentle and translated them into elegant and responsive UI.
                                    </p>
                                    <Image
                                        src="/images/user.profile/butty.artistic.png"
                                        alt="Butty mascot"
                                        width={90}
                                        height={70}
                                        className="hidden xs:block absolute -top-12 -right-8"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BALUYUT */}
                        <div className="mb-4 mt-8">
                            <h3 className="font-bold mb-2">
                                <span className="text-blue-700">🎨 Baluyut</span>
                                <span className="text-blue-300">, Sebastian A.</span>
                            </h3>
                            <div className="bg-neutral-white rounded-lg p-4 relative">
                                <div className="relative w-full">
                                    <p className="text-sm font-bold text-blue-300">Visual Identity & Brand Design Lead</p>
                                    <p className="text-sm text-blue-300 font-medium mt-1">
                                        Created BaybayInscribe’s signature look, including the mascot design, color systems,
                                        and visual assets rooted in Filipino culture.
                                    </p>
                                    <Image
                                        src="/images/user.profile/butty.artistic.png"
                                        alt="Butty mascot"
                                        width={90}
                                        height={70}
                                        className="hidden xs:block absolute -top-12 -right-8"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CUIZON */}
                        <div className="mb-4 mt-8">
                            <h3 className="font-bold mb-2">
                                <span className="text-blue-700">📈 Cuizon</span>
                                <span className="text-blue-300">, Antoinette P.</span>
                            </h3>
                            <div className="bg-neutral-white rounded-lg p-4 relative">
                                <div className="relative w-full">
                                    <p className="text-sm font-bold text-blue-300">Strategic Planning & Product Analyst</p>
                                    <p className="text-sm text-blue-300 font-medium mt-1">
                                        Led business modeling, workflow mapping, and core requirement analysis,
                                        ensuring the platform aligned with both user needs and long-term goals.
                                    </p>
                                    <Image
                                        src="/images/user.profile/butty.writer.png"
                                        alt="Butty mascot"
                                        width={90}
                                        height={70}
                                        className="hidden xs:block absolute -top-12 -right-8"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* YOLDI */}
                        <div className="mb-4 mt-8">
                            <h3 className="font-bold mb-2">
                                <span className="text-blue-700">📝 Yoldi</span>
                                <span className="text-blue-300">, Jhayrome</span>
                            </h3>
                            <div className="bg-neutral-white rounded-lg p-4 relative">
                                <div className="relative w-full">
                                    <p className="text-sm font-bold text-blue-300">Technical Writing & Documentation Assistant</p>
                                    <p className="text-sm text-blue-300 font-medium mt-1">
                                        Contributed to internal and user-facing documentation, ensuring clarity and
                                        coherence across app instructions, developer notes, and team records.
                                    </p>
                                    <Image
                                        src="/images/user.profile/butty.writer.png"
                                        alt="Butty mascot"
                                        width={90}
                                        height={70}
                                        className="hidden xs:block absolute -top-12 -right-8"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Settings Overlay */}
            <MobileSettings
                isVisible={isSettingsVisible}
                onClose={() => setIsSettingsVisible(false)}
                onSignOut={handleSignOut}
            />
        </div>
    );
};

export default MobileAbout;
