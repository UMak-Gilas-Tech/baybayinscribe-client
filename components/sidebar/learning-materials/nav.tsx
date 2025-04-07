"use client";

import React from "react";
import Link from "next/link";

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  buttonText?: string;
}

function GuideCard({ title, description, href, buttonText = "Start Learning" }: NavCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="relative h-44 bg-[#e9f5f2] flex items-center justify-center">
        <div className="w-12 h-12 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="#4285F4"/>
            <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="#4285F4"/>
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-[#1e3e59] mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{description}</p>
        <Link 
          href={href}
          className="block w-full py-2 text-center text-white bg-[#1e3e59] rounded-md text-xs font-medium hover:bg-[#152d42] transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

function QuizCard({ title, description, href, buttonText = "Start Learning" }: NavCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="relative h-44 bg-[#e9f5f2] flex items-center justify-center">
        <div className="w-12 h-12 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="#4285F4"/>
            <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="#4285F4"/>
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-[#1e3e59] mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{description}</p>
        <Link 
          href={href}
          className="block w-full py-2 text-center text-white bg-[#1e3e59] rounded-md text-xs font-medium hover:bg-[#152d42] transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

export function LearningMaterialsNav() {
  const guides = [
    {
      title: "Baybayin vowels",
      description: "Learn the basic vowel characters of the Baybayin script",
      href: "#"
    },
    {
      title: "Baybayin Kudlit",
      description: "Learn the basic kudlit characters of the Baybayin script",
      href: "#"
    },
    {
      title: "Baybayin Consonant",
      description: "Learn the basic consonant characters of the Baybayin script",
      href: "#"
    },
    {
      title: "Coming Soon",
      description: "New Baybayin lesson on the way. Stay tuned!",
      href: "#"
    }
  ];

  const quizzes = [
    {
      title: "Multiple Choice Quiz",
      description: "Test your knowledge with multiple choice questions",
      href: "#"
    },
    {
      title: "Fill in the Blank Quiz",
      description: "Complete Baybayin words by selecting the correct symbols",
      href: "#"
    },
    {
      title: "Sketch Quiz",
      description: "Draw Baybayin characters to test your memory and handwriting",
      href: "#"
    },

  ];

  return (
    <div className="p-4 bg-[#f0f0f0]">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-[#1e3e59] uppercase">Guide to Baybayin</h2>
        <div className="overflow-x-auto">
          <div className="flex pb-2 space-x-4" style={{ width: "max-content" }}>
            {guides.map((guide) => (
              <div key={guide.title} className="w-56 flex-shrink-0">
                <GuideCard {...guide} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-[#1e3e59] uppercase">AI Quiz</h2>
        <div className="overflow-x-auto">
          <div className="flex pb-2 space-x-4" style={{ width: "max-content" }}>
            {quizzes.map((quiz) => (
              <div key={quiz.title} className="w-56 flex-shrink-0">
                <QuizCard {...quiz} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}