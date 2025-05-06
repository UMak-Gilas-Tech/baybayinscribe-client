"use client"
import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";
import { authClient } from '@/app/lib/auth-client'
import { useRouter } from 'next/navigation'

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  contactNumber: string;
  dateOfBirth: string;
  email: string;
  authProviders: Array<{ name: string; linked: boolean }>;
};

export default function ProfileDesktop({ userData }: { userData: UserData }) {
const router = useRouter()
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/login')
        }
      }
    })
  } 


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg overflow-hidden border border-gray-200 rounded-lg">
        <div className="flex">


          {/* Left Sidebar */}
          <div className="w-64 bg-[#f5f5f5] p-6 border-r border-gray-200">

            <h2 className="text-xl font-bold mb-6">Settings</h2>

            <nav className="space-y-1">
              <Link href="/profile/settings/accounts" className="block py-2 px-3 text-blue-600 font-medium bg-blue-50 rounded-md">
                Account
              </Link>

              <Link href="/profile/settings/preferences" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md">
                Preferences
              </Link>

              <Link href="/profile/settings/terms" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md">
                Terms of service
              </Link>

              <Link href="/profile/settings/about" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md">
                About
              </Link>
            </nav>


            {/* Log Out Account */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <button 
              onClick={handleSignOut}
                className="flex w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Log out
              </button>
            </div>


            {/* Delete Account */}
            <div className="mt-32 pt-8">
              <div className="flex items-center hover:bg-gray-200">
                <svg className="w-5 h-5 text-red-500 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <button className="text-red-600">Delete Account</button>
              </div>
            </div>
          </div>


          {/* Main Content */}
          <div className="flex-1 relative">
            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Your Account</h2>
                <button className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>


              {/* Profile avatar section */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#4F6AE0" />
                    <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#4F6AE0" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{userData.firstName} {userData.lastName}</h3>
                  <p className="text-sm text-gray-500">{userData.username}</p>
                  <Link href="/profile/settings/accounts/edit" className="text-sm text-blue-600 mt-1">Edit Profile</Link>
                </div>
              </div>


              {/* Account info section */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 mb-3">Account Info</h3>
                  {/*Butty stand image */}
                  <div className="h-3 w-16">
                    <Image
                      src="/images/butty.stand.png"
                      alt="Butty mascot"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
                <div className="space-y-3 bg-neutral-white p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.9V19.9C22 20.4 21.6 21 21 21C18.3 21 15.6 20.1 13.4 18.4C11.2 16.8 9.5 14.6 8.5 12.1C7.4 9.7 7 7 7.1 4.3C7.1 3.7 7.7 3.2 8.2 3.2H11.2C11.7 3.2 12.1 3.6 12.2 4.1C12.3 5.1 12.5 6 12.8 6.9C13 7.4 12.8 7.9 12.4 8.2L10.8 9.8C11.7 12.1 13.7 14 16 15C16.4 14.6 17 14.4 17.6 14.6C18.4 14.9 19.4 15.1 20.3 15.2C20.9 15.4 21.3 15.9 22 16.9Z" fill="currentColor" />
                    </svg>
                    <span className="text-gray-600">{userData.contactNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-gray-600">Date of Birth: {userData.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-gray-600">{userData.email}</span>
                  </div>
                </div>
              </div>


              {/* Auth provider section */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 mb-3">Auth Provider</h3>
                  {/*Butty thumbsup */}
                  <div className="h-2 w-16">
                    <Image
                      src="/images/butty.thumbsup.png"
                      alt="Butty mascot"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
                <div className="space-y-3 bg-neutral-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image src="/images/google.icon.account.png" alt="Google" width={20} height={20} className="mr-3" />
                      <span className="text-gray-600">Google Account Linked</span>
                    </div>
                    <button className="text-red-600 text-sm">Unlink</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image src="/images/facebook.icon.account.png" alt="Facebook" width={20} height={20} className="mr-3" />
                      <span className="text-gray-600">Facebook Account Linked</span>
                    </div>
                    <button className="text-red-600 text-sm">Unlink</button>
                  </div>
                </div>
              </div>
            </div>


            {/* Butty waving */}
            <div className="absolute bottom-0 right-0 h-30 w-50">
              <Image
                src="/images/butty.waving.png"
                alt="Butty waving"
                width={200}
                height={200}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 