'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Validate required fields
      if (!formData.email || !formData.name || !formData.subject || !formData.message) {
        throw new Error('Please fill in all required fields')
      }
      
      // Send email notification via API route
      const notificationResponse = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Contact Form: ${formData.subject}`,
          message: formData.message,
          isContactForm: true
        }),
      });
      
      if (!notificationResponse.ok) {
        console.warn('Failed to send notification email');
        try {
          const errorData = await notificationResponse.json();
          console.error('Email notification error details:', errorData);
          
          // Store in localStorage as fallback
          const contactMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
          const newMessage = {
            id: Date.now(),
            ...formData,
            created_at: new Date().toISOString()
          };
          contactMessages.push(newMessage);
          localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
          
          console.log('Stored contact message in localStorage as fallback');
        } catch (e) {
          console.error('Could not parse notification error response');
        }
      }
      
      // Consider it a success even if notification fails - at least we tried
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Contact information */}
            <div className="relative overflow-hidden bg-gradient-to-r from-ncaa-blue to-ncaa-darkblue py-10 px-6 sm:px-10 xl:p-12">
              <div className="absolute inset-0 pointer-events-none sm:hidden" aria-hidden="true">
                <svg className="absolute inset-0 w-full h-full" width="100%" height="100%" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 0 L100 0 L100 100 Z" fill="currentColor" />
                </svg>
              </div>
              <div className="relative">
                <h3 className="text-lg font-medium text-white">Contact Us</h3>
                <p className="mt-6 text-base text-white max-w-3xl">
                  Have questions about NILytics? Our team is ready to help! Reach out using the contact form or through email.
                </p>
                <dl className="mt-8 space-y-6">
                  <dt><span className="sr-only">Email</span></dt>
                  <dd className="flex text-base text-white">
                    <svg className="flex-shrink-0 w-6 h-6 text-ncaa-lightblue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="ml-3">ankitdevalla.dev@gmail.com</span>
                  </dd>
                </dl>
                <div className="mt-12">
                  <h4 className="text-white text-sm font-semibold mb-4">Follow Us</h4>
                  <ul role="list" className="flex space-x-6">
                    <li>
                      <a className="text-white hover:text-ncaa-lightblue" href="#">
                        <span className="sr-only">Twitter</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a className="text-white hover:text-ncaa-lightblue" href="#">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-12">
                  <div className="border-t border-white/20 pt-8">
                    <p className="text-base text-white/80">
                      We typically respond to inquiries within 24 business hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12">
              <h3 className="text-2xl font-bold text-ncaa-darkblue">Send us a message</h3>
              
              {isSubmitted ? (
                <div className="mt-8 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">Thank you for your message!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    We've received your inquiry and will get back to you as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  {error && (
                    <div className="sm:col-span-2 rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
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
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <h3 className="text-xl font-medium text-ncaa-darkblue mb-4">Frequently Asked Questions</h3>
          <div className="max-w-3xl mx-auto grid gap-8 md:grid-cols-2 lg:gap-12">
            <div className="bg-white p-6 rounded-lg shadow-sm text-left">
              <h4 className="text-base font-medium text-gray-900 mb-2">How soon will I get a response?</h4>
              <p className="text-sm text-gray-500">We typically respond to inquiries within 24 business hours.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-left">
              <h4 className="text-base font-medium text-gray-900 mb-2">Do you offer technical support?</h4>
              <p className="text-sm text-gray-500">Yes, our support team is available Monday through Friday, 9 AM to 5 PM ET.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-left">
              <h4 className="text-base font-medium text-gray-900 mb-2">Can I request a custom demo?</h4>
              <p className="text-sm text-gray-500">Absolutely! Let us know your specific needs in the message field, and we'll tailor a demo for your institution.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-left">
              <h4 className="text-base font-medium text-gray-900 mb-2">What information should I include in my message?</h4>
              <p className="text-sm text-gray-500">For the quickest response, include your institution name, role, and specific questions or requirements you have.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 