'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Updated navigation links - only keeping Features, Pricing, and Contact
const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-1 glass-effect backdrop-blur-md' : 'py-2 bg-transparent'
    }`}>
      <div className={`mx-auto rounded-2xl transition-all duration-300 ${
        scrolled ? 'glass-effect shadow-sm' : ''
      }`}>
        <div className="flex items-center justify-between px-4 py-2 sm:px-6">
          {/* Logo - Left side */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 relative mr-3">
                <Image 
                  src="/logo.png" 
                  alt="NILytics Logo" 
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-md"
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-ncaa-darkblue">
                NILytics
              </span>
            </Link>
          </div>
          
          {/* Right side - Navigation and Auth buttons */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Navigation links moved to the right */}
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-ncaa-blue font-medium transition-colors px-2 py-1 text-sm rounded-md relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ncaa-lightblue transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
            
            {/* Auth buttons */}
            <div className="flex space-x-4">
              <Link 
                href="/dashboard" 
                className="lando-button-secondary"
              >
                Login
              </Link>
              <a
                href="#demo"
                className="lando-button-primary"
              >
                Book a Demo
              </a>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-ncaa-blue focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          id="mobile-menu"
        >
          <div className="px-4 pt-2 pb-4 space-y-1 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-ncaa-blue hover:bg-ncaa-blue/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
              <Link
                href="/dashboard"
                className="text-center w-full px-4 py-2 text-base font-medium text-gray-700 hover:text-ncaa-blue border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <a
                href="#demo"
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-ncaa-blue hover:bg-ncaa-darkblue"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 