"use client"
import React from 'react'
import { authClient } from '../lib/auth-client'
import { useRouter } from 'next/navigation'


const SignedInScreen = () => {
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
    <div className='flex flex-col items-center justify-center h-screen'>
        <button
        onClick={handleSignOut}
        className="underline hover:underline"
      >
        Log Out
      </button>
    </div>
  )
}


export default SignedInScreen;
