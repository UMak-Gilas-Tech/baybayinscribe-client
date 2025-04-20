"use client"
import React from 'react'
import Link from 'next/link'
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
         {/*<Link href="/auth/login" className="underline hover:underline">
          <h1>Sign In</h1>
        </Link>
        <Link href="/auth/register" className="underline hover:underline">
          <h1>Sign Up</h1>
        </Link> */}
        <button
        onClick={handleSignOut}
        className="underline hover:underline"
      >
        Sign Out
      </button>
    </div>
  )
}


export default SignedInScreen;
