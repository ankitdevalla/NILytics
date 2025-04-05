'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { isAdmin, signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const adminStatus = await isAdmin()
        setAuthorized(adminStatus)
        
        if (!adminStatus) {
          // Redirect non-admin users to dashboard
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        // On error, redirect to dashboard
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [router])

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      // The redirect is handled in the signOut function
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin area.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-ncaa-darkblue text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/admin" className="font-bold text-xl">NILytics Admin</Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/admin/users" className="text-white hover:text-white/80">
                  Users
                </Link>
                <Link href="/admin/demo-requests" className="text-white hover:text-white/80">
                  Demo Requests
                </Link>
                <Link href="/dashboard" className="text-white hover:text-white/80">
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="text-white hover:text-white/80 disabled:opacity-50"
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
} 