"use client"
import React from 'react'

const SignedInScreen = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <a href="/auth/login" className="underline hover:underline">
          <h1>Sign In</h1>
        </a>
        <a href="/auth/register" className="underline hover:underline">
          <h1>Sign Up</h1>
        </a>
    </div>
  )
}

export default SignedInScreen;