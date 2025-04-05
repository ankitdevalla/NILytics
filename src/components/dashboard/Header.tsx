'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut, getUser } from '@/lib/auth'

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (showUserMenu) setShowUserMenu(false)
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
    if (showNotifications) setShowNotifications(false)
  }

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

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (!user || !user.email) return 'U';
    
    // Try to get initials from user_metadata.name if it exists
    if (user.user_metadata?.name) {
      return user.user_metadata.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    // Fallback to first letter of email
    return user.email.charAt(0).toUpperCase();
  }

  // Get display name
  const getDisplayName = () => {
    if (!user) return '';
    
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }
    
    if (user.email) {
      // Return the part before @ in the email
      return user.email.split('@')[0];
    }
    
    return 'User';
  }

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left section - Page title */}
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        
        {/* Right section - Search, notifications, user */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ncaa-blue focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="relative p-2 text-gray-600 hover:text-ncaa-blue hover:bg-gray-100 rounded-full focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[1, 2, 3].map((item) => (
                    <Link 
                      key={item} 
                      href="#"
                      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-ncaa-blue flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">New compliance alert</p>
                          <p className="text-xs text-gray-500 mt-1">Title IX threshold approaching for men's football payments</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <Link href="#" className="text-xs text-ncaa-blue font-medium hover:underline">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* User menu */}
          <div className="relative">
            <button 
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {loading ? "..." : getUserInitials()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {loading ? "Loading..." : getDisplayName()}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Your Profile
                </Link>
                <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 