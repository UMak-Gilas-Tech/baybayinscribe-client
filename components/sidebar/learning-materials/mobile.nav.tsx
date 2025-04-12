"use client";

import React from "react";
import Link from "next/link";
import { FileIcon, ChevronRight } from "lucide-react";

interface NavItemProps {
  title: string;
  description: string;
  href: string;
}

function GuideItem({ title, description, href }: NavItemProps) {
  return (
    <Link 
      href={href}
      className="bg-white rounded-md p-4 flex items-center justify-between border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="rounded p-1">
          <FileIcon className="h-5 w-5 text-blue-300" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-blue-950">{title}</h3>
          <p className="text-xs text-grey-300">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </Link>
  );
}

function ComingSoonItem({ title, description }: Omit<NavItemProps, 'href'>) {
  return (
    <div className="bg-white rounded-md p-4 flex items-center justify-between border border-gray-200 opacity-75">
      <div className="flex items-center gap-3">
        <div className="rounded p-1">
          <FileIcon className="h-5 w-5"/>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
          <p className="text-xs text-grey-300">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </div>
  );
}

function QuizItem({ title, description, href }: NavItemProps) {
  return (
    <Link 
      href={href}
      className="bg-white rounded-md p-4 flex items-center justify-between border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="rounded p-1">
          <FileIcon className="h-5 w-5 text-blue-300"/>
        </div>
        <div>
          <h3 className="text-sm font-medium text-blue-300">{title}</h3>
          <p className="text-xs text-grey-300">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </Link>
  );
}

export function ResponsiveNav() {
  const guides = [
    {
      title: "Baybayin vowels",
      description: "Learn the basic vowel characters of the Baybayin script",
      href: "#",
    },
    {
      title: "Baybayin Kudlit",
      description: "Learn the basic kudlit characters of the Baybayin script",
      href: "#",
    },
    {
      title: "Baybayin Consonant",
      description: "Learn the basic consonant characters of the Baybayin script",
      href: "#",
    },
    {
      title: "Coming Soon",
      description: "New Baybayin lesson on the way. Stay tuned!",
    },
  ];

  const quizzes = [
    {
      title: "Shuffle Mode",
      description: "Complete Baybayin words by selecting the correct symbols",
      href: "#",
    },
    {
      title: "Multiple Choice",
      description: "Draw Baybayin characters to test your memory and handwriting",
      href: "#",
    },
    {
      title: "Sketch Quiz",
      description: "Draw Baybayin characters to test your memory and handwriting",
      href: "#",
    },
  ];

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full overflow-y-auto p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-blue-400">
                GUIDE TO BAYBAYIN
              </h1>
            </div>
            <div className="text-gray-400">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                  fill="currentColor"
                />
                <path
                  d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                  fill="currentColor"
                />
                <path
                  d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            {guides.map((guide) =>
              guide.href ? (
                <GuideItem key={guide.title} {...guide} />
              ) : (
                <ComingSoonItem
                  key={guide.title}
                  title={guide.title}
                  description={guide.description}
                />
              )
            )}
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-blue-400">AI QUIZ</h2>
          </div>

          <div className="space-y-2">
            {quizzes.map((quiz) => (
              <QuizItem key={quiz.title} {...quiz} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}