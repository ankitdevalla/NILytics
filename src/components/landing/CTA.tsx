'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [institution, setInstitution] = useState('')
  const [role, setRole] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      // Store data in localStorage for demo purposes
      // In a real app, you would send this to your backend API
      const waitlistData = { 
        email, 
        institution, 
        role, 
        timestamp: new Date().toISOString() 
      }
      
      // Get existing waitlist entries or initialize empty array
      const existingData = JSON.parse(localStorage.getItem('waitlistEntries') || '[]')
      
      // Add new entry
      existingData.push(waitlistData)
      
      // Save back to localStorage
      localStorage.setItem('waitlistEntries', JSON.stringify(existingData))
      
      console.log('Waitlist submission saved:', waitlistData)
      setIsSubmitted(true)
      
      // Reset form after success
      setTimeout(() => {
        setEmail('')
        setInstitution('')
        setRole('')
        setIsSubmitted(false)
      }, 3000)
    } catch (err) {
      console.error('Error saving waitlist data:', err)
      setError('There was an error submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="waitlist" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-ncaa-blue to-ncaa-lightblue rounded-2xl overflow-hidden shadow-xl">
          <div className="md:grid md:grid-cols-5">
            {/* Left side content */}
            <div className="md:col-span-2 px-6 py-12 sm:px-12 flex flex-col justify-center">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 relative mr-3">
                  <Image 
                    src="/logo.png" 
                    alt="NILytics Logo" 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded-md"
                  />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  NILytics Waitlist
                </h2>
              </div>
              <p className="text-lg text-white/90 mb-8">
                Be among the first to experience our data-driven NIL compliance solution when we launch.
              </p>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-20 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-medium text-white">Early Access</p>
                    <p className="mt-1 text-sm text-white/70">Get priority access when we launch</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-20 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-medium text-white">Exclusive Pricing</p>
                    <p className="mt-1 text-sm text-white/70">Special discount for early adopters</p>
                  </div>
                </div>
                
                <div className="mt-8 py-4 px-6 bg-white/10 rounded-lg">
                  <p className="text-white font-medium">Admin Access:</p>
                  <p className="text-sm text-white/80 mb-3">View waitlist entries in the admin panel</p>
                  <Link 
                    href="/admin/waitlist" 
                    className="inline-flex items-center px-4 py-2 bg-white text-ncaa-blue rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    View Submissions
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side form */}
            <div className="md:col-span-3 bg-white p-6 sm:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Get notified when NILytics launches
              </h3>
              
              {isSubmitted ? (
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <svg className="h-12 w-12 text-green-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-xl font-medium text-gray-900 mb-2">Thank you for joining!</h4>
                  <p className="text-gray-600">We'll keep you updated on our progress and let you know when NILytics launches.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-ncaa-lightblue focus:border-ncaa-lightblue"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                      Institution / Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="institution"
                      id="institution"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="mt-1 block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-ncaa-lightblue focus:border-ncaa-lightblue"
                      placeholder="University of..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Your Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="mt-1 block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-ncaa-lightblue focus:border-ncaa-lightblue"
                      required
                    >
                      <option value="" disabled>Select your role</option>
                      <option value="athletic_director">Athletic Director</option>
                      <option value="compliance_officer">Compliance Officer</option>
                      <option value="coach">Coach</option>
                      <option value="administrator">Administrator</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="agreement"
                      name="agreement"
                      type="checkbox"
                      className="h-4 w-4 text-ncaa-blue focus:ring-ncaa-lightblue border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="agreement" className="ml-2 block text-sm text-gray-600">
                      I agree to receive communications about NILytics
                    </label>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-ncaa-blue to-ncaa-lightblue hover:from-ncaa-darkblue hover:to-ncaa-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Join the Waitlist'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 