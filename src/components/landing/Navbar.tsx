'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About us', href: '#about' },
  { name: 'Contact', href: '#contact' },
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
      scrolled ? 'py-2 glass-effect backdrop-blur-md' : 'py-4 bg-transparent'
    }`}>
      <div className={`mx-auto rounded-2xl transition-all duration-300 ${
        scrolled ? 'glass-effect shadow-sm' : ''
      }`}>
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-ncaa-blue to-ncaa-lightblue">
                NIL Compliance
              </span>
              <div className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-ncaa-blue/10 to-ncaa-lightblue/10 text-ncaa-blue">
                BETA
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <div className="flex space-x-8">
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
          </div>
          
          {/* Right side - Auth buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/signin"
              className="text-gray-700 hover:text-ncaa-blue font-medium transition-colors px-3 py-2 text-sm"
            >
              Log in
            </Link>
            <Link
              href="#waitlist"
              className="bg-gradient-to-r from-ncaa-blue to-ncaa-lightblue hover:from-ncaa-darkblue hover:to-ncaa-blue text-white font-medium rounded-xl px-5 py-2 text-sm transition-all duration-300 hover:shadow-md"
            >
              Join Waitlist
            </Link>
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
                href="/signin"
                className="text-center w-full px-4 py-2 text-base font-medium text-gray-700 hover:text-ncaa-blue border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="#waitlist"
                className="text-center w-full px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-ncaa-blue to-ncaa-lightblue border border-transparent rounded-xl hover:from-ncaa-darkblue hover:to-ncaa-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 