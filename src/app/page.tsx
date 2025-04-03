import React from 'react'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Testimonials from '@/components/landing/Testimonials'
import PricingTable from '@/components/landing/PricingTable'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="bg-gradient-to-b from-white to-sky-50 min-h-screen overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {/* Abstract background shapes */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ncaa-lightblue/30 filter blur-3xl opacity-30"></div>
          <div className="absolute top-1/3 -left-24 w-80 h-80 rounded-full bg-ncaa-blue/30 filter blur-3xl opacity-40"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-ncaa-gold/20 filter blur-3xl opacity-30"></div>
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Navbar />
        </div>
        
        <Hero />
        
        <div className="relative mt-16">
          <Features />
        </div>
        
        <div className="relative mt-10 md:mt-16">
          <Testimonials />
        </div>
        
        <div className="relative mt-10 md:mt-16">
          <PricingTable />
        </div>
        
        <div className="relative mt-10 md:mt-16">
          <CTA />
        </div>
        
        <div className="relative mt-20">
          <Footer />
        </div>
      </div>
    </main>
  )
} 