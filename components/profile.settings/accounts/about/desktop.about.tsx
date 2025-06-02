"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

interface DesktopAboutProps {
  onClose: () => void;
  onProfileClick: () => void;
  onShowTerms: () => void;
  // onShowPreferences?: () => void;
}

export default function DesktopAbout({
  onClose,
  onProfileClick,
  onShowTerms,
}: DesktopAboutProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
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
            <button
              onClick={onShowTerms}
              className="w-full py-2 text-blue-500 hover:text-blue-600 text-left cursor-pointer"
            >
              Terms of service
            </button>
            <button className="w-full py-2 text-blue-300 font-medium text-left cursor-pointer">
              About
            </button>
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-700 py-2 hover:text-blue-600 cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 17L21 12L16 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Log out
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <Image
              src="/images/user.profile/butty.waving.left.webp"
              alt="Butty mascot"
              width={250}
              height={250}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-7 relative overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Image
                src="/images/BaybayInscribe-AppIcon.webp"
                alt="BaybayInscribe Icon"
                width={40}
                height={40}
              />
              <h2 className="text-xl text-blue-300 font-bold">
                About BaybayInscribe
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-blue-300 font-medium mt-2 mb-6">
            We aim to revive the Baybayin script by combining tech and tradition
            making learning our native script accessible, fun, and meaningful.
          </p>

          {/* Meet the Butty Whale Section */}
          <div className="mb-4 mt-16">
            <h3 className="mb-2 text-blue-300 font-bold">
              Meet the Butty Whale
            </h3>
            <div className="bg-neutral-white rounded-lg p-4 relative">
              <div className="relative w-full">
                <p className="text-sm text-blue-300 font-medium w-[80%]">
                  Butty is your friendly whale mascot, guiding you through the
                  BaybayInscribe experience. With a playful spirit and a love
                  for learning, Butty is here to make your journey enjoyable and
                  engaging.
                </p>
                <Image
                  src="/images/user.profile/butty.stand.webp"
                  alt="Butty mascot"
                  width={100}
                  height={70}
                  className="absolute -top-20 -right-10"
                />
              </div>
            </div>
          </div>

          {/* Meet the Developers */}
          <div className="mt-16">
            <h3 className="text-lg font-bold text-blue-300 mb-4">
              👨‍💻 Meet the Developers
            </h3>
            <div className="bg-neutral-white rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-300 font-medium">
                A dynamic team united by the mission to revive Baybayin through
                interactive learning and cultural tech.
              </p>
            </div>

            <div className="space-y-8">
              {/* VILLAROSA */}
              <div className="mb-4">
                <h3 className="mb-2 font-bold">
                  <span className="text-blue-700">🧠⚙️ Villarosa</span>
                  <span className="text-blue-300">, Jam Emmanuel</span>
                </h3>
                <div className="bg-neutral-white rounded-lg p-4 relative">
                  <div className="relative w-full">
                    <p className="text-sm font-bold text-blue-300">
                      Project Director, Full-Stack Engineer & AI Architect
                    </p>
                    <p className="text-sm text-blue-300 font-medium mt-2">
                      Led the system architecture, team coordination, and
                      developed the AI-backed features.
                    </p>
                    <Image
                      src="/images/user.profile/butty.coder.webp"
                      alt="Butty mascot"
                      width={80}
                      height={70}
                      className="absolute -top-16 -right-10"
                    />
                  </div>
                </div>
              </div>

              {/* VILLENA */}
              <div className="mb-4">
                <h3 className="mb-2 font-bold">
                  <span className="text-blue-700">🔧💻 Villena</span>
                  <span className="text-blue-300">, Lans Clarence S.</span>
                </h3>
                <div className="bg-neutral-white rounded-lg p-4 relative">
                  <div className="relative w-full">
                    <p className="text-sm font-bold text-blue-300">
                      Senior Full-Stack Developer
                    </p>
                    <p className="text-sm text-blue-300 font-medium mt-2">
                      Engineered robust backend and frontend features for smooth
                      and scalable performance.
                    </p>
                    <Image
                      src="/images/user.profile/butty.coder.webp"
                      alt="Butty mascot"
                      width={80}
                      height={70}
                      className="absolute -top-16 -right-10"
                    />
                  </div>
                </div>
              </div>

              {/* SIAZON */}
              <div className="mb-4">
                <h3 className="mb-2 font-bold">
                  <span className="text-blue-700">🖌️💻 Siazon</span>
                  <span className="text-blue-300">, Mark Angelo D.</span>
                </h3>
                <div className="bg-neutral-white rounded-lg p-4 relative">
                  <div className="relative w-full">
                    <p className="text-sm font-bold text-blue-300">
                      Lead UI/UX Designer & Associate Front-End Developer
                    </p>
                    <p className="text-sm text-blue-300 font-medium mt-2">
                      Designed user-defining gentle and translated them into
                      elegant and responsive UI.
                    </p>
                    <Image
                      src="/images/user.profile/butty.artistic.webp"
                      alt="Butty mascot"
                      width={90}
                      height={70}
                      className="absolute -top-12 -right-10"
                    />
                  </div>
                </div>
              </div>

              {/* BALUYUT */}
              <div className="mb-4">
                <h3 className="mb-2 font-bold">
                  <span className="text-blue-700">🎨 Baluyut</span>
                  <span className="text-blue-300">, Sebastian A.</span>
                </h3>
                <div className="bg-neutral-white rounded-lg p-4 relative">
                  <div className="relative w-full">
                    <p className="text-sm font-bold text-blue-300">
                      Visual Identity & Brand Design Lead
                    </p>
                    <p className="text-sm text-blue-300 font-medium mt-2">
                      Created BaybayInscribe&apos;s signature look, including
                      the mascot design, color systems, and visual assets rooted
                      in Filipino culture.
                    </p>
                    <Image
                      src="/images/user.profile/butty.artistic.webp"
                      alt="Butty mascot"
                      width={90}
                      height={70}
                      className="absolute -top-12 -right-10"
                    />
                  </div>
                </div>
              </div>

              {/* CUIZON */}
              <div className="mb-4">
                <h3 className="mb-2 font-bold">
                  <span className="text-blue-700">📈 Cuizon</span>
                  <span className="text-blue-300">, Antoinette P.</span>
                </h3>
                <div className="bg-neutral-white rounded-lg p-4 relative">
                  <div className="relative w-full">
                    <p className="text-sm font-bold text-blue-300">
                      Strategic Planning & Product Analyst
                    </p>
                    <p className="text-sm text-blue-300 font-medium mt-2">
                      Led business modeling, workflow mapping, and core
                      requirement analysis, ensuring the platform aligned with
                      both user needs and long-term goals.
                    </p>
                    <Image
                      src="/images/user.profile/butty.writer.webp"
                      alt="Butty mascot"
                      width={90}
                      height={70}
                      className="absolute -top-12 -right-10"
                    />
                  </div>
                </div>
              </div>

              {/* YOLDI */}
              <div className="mb-32">
                <h3 className="mb-2 font-bold">
                  <span className="text-blue-700">📝 Yoldi</span>
                  <span className="text-blue-300">, Jhayrome</span>
                </h3>
                <div className="bg-neutral-white rounded-lg p-4 relative">
                  <div className="relative w-full">
                    <p className="text-sm font-bold text-blue-300">
                      Technical Writing & Documentation Assistant
                    </p>
                    <p className="text-sm text-blue-300 font-medium mt-2">
                      Contributed to internal and user-facing documentation,
                      ensuring clarity and coherence across app instructions,
                      developer notes, and team records.
                    </p>
                    <Image
                      src="/images/user.profile/butty.writer.webp"
                      alt="Butty mascot"
                      width={90}
                      height={70}
                      className="absolute -top-12 -right-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
