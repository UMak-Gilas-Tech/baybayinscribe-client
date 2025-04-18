"use client"
import React from 'react'
import Link from 'next/link'

const SignedInScreen = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <Link href="/auth/login" className="underline hover:underline">
          <h1>Sign In</h1>
        </Link>
        <Link href="/auth/register" className="underline hover:underline">
          <h1>Sign Up</h1>
        </Link>
    </div> 
  )
}

export default SignedInScreen;