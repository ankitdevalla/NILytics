'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createDemoRequest } from '@/lib/supabase'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [institution, setInstitution] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preferredTime, setPreferredTime] = useState('')
  const [message, setMessage] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreeToTerms) {
      setError('Please agree to receive communications about NILytics')
      return
    }

    setIsSubmitting(true)
    setError(null)
    
    try {
      // Validate required fields
      if (!email || !name || !institution) {
        throw new Error('Please fill in all required fields')
      }
      
      // Create demo request using our utility function
      await createDemoRequest({
        name, 
        email, 
        institution, 
        phone_number: phoneNumber,
        preferred_time: preferredTime,
        message
      });
      
      // Send email notification via API route
      const notificationResponse = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          institution,
          phoneNumber,
          preferredTime,
          message
        }),
      });
      
      if (!notificationResponse.ok) {
        console.warn('Failed to send notification email, but demo request was saved');
        try {
          const errorData = await notificationResponse.json();
          console.error('Email notification error details:', errorData);
        } catch (e) {
          console.error('Could not parse notification error response');
        }
      }
      
      // If we got here, it was successful
      setIsSubmitted(true)
      
      // Reset form
      setEmail('')
      setName('')
      setInstitution('')
      setPhoneNumber('')
      setPreferredTime('')
      setMessage('')
      setAgreeToTerms(false)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="demo" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Book a Demo of NILytics
            </h2>
          <p className="mt-4 text-lg text-gray-600">
            See our data-driven NIL compliance solution in action and discover how it can help your athletic department.
          </p>
        </div>
        
        <div className="mx-auto mt-12 max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            {isSubmitted ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Thank you for your interest!</h3>
                <p className="mt-2 text-sm text-gray-500">
                  We've received your demo request and will contact you shortly to schedule a convenient time.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Our team has been notified and will usually respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue"
                >
                  Request Another Demo
                </button>
              </div>
            ) : (
              <div>
                <div className="mt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              {error}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                          Institution <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="institution"
                            id="institution"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
                          Preferred Demo Time
                        </label>
                        <div className="mt-1">
                          <select
                            id="preferredTime"
                            name="preferredTime"
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                          >
                            <option value="">Select a time</option>
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Evening">Evening</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="message"
                            name="message"
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                          ></textarea>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Let us know if you have any specific questions or areas of interest.</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-ncaa-blue focus:ring-ncaa-blue"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="terms" className="font-medium text-gray-700">
                            I agree to receive communications about NILytics
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Book Your Demo'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="h-full rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <div className="flex justify-center">
                  <Image
                    src="/logo.png"
                    alt="NILytics Logo"
                    width={180}
                    height={60}
                    className="h-auto w-auto mb-4"
                  />
                </div>
                <p className="text-base font-semibold text-gray-600">Why Book a Demo?</p>
                <ul className="mt-6 space-y-4 text-left text-sm leading-6 text-gray-600">
                  <li className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-ncaa-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    See real-time compliance dashboards
                  </li>
                  <li className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-ncaa-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Learn how to track NIL payments
                  </li>
                  <li className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-ncaa-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Get Title IX compliance insights
                  </li>
                  <li className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-ncaa-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Ask questions specific to your institution
                  </li>
                </ul>
                <p className="mt-6 text-xs leading-5 text-gray-600">
                  No commitment required. We'll walk you through how NILytics can address your specific compliance needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 