'use client'

import React from 'react'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Sign In</h1>
        <p className="text-white/80 text-center mb-6">
          Authentication coming soon. For now, please join our waitlist.
        </p>
        <Link 
          href="/" 
          className="block w-full bg-white text-blue-600 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
} 