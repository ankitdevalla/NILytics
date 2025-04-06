import React from 'react'
import Image from 'next/image'

export default function FutureProof() {
  return (
    <section id="future-proof" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-white opacity-70 -z-10"></div>
      <div className="absolute top-1/4 -right-32 w-64 h-64 bg-ncaa-gold/10 rounded-full filter blur-3xl opacity-70 -z-10"></div>
      <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-ncaa-blue/10 rounded-full filter blur-3xl opacity-70 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <p className="inline-block text-sm font-semibold uppercase tracking-wide text-ncaa-blue bg-blue-50 px-3 py-1 rounded-full mb-4">
              Forward-Thinking Solution
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ncaa-darkblue mb-6">
              Future-Proof Your Program
            </h2>
            
            <div className="space-y-6">
              <p className="text-lg text-gray-600">
                NIL and revenue-sharing regulations continue to evolve rapidly. Our platform adapts alongside these changes, ensuring your athletic department stays ahead of the curve.
              </p>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-ncaa-blue">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Adaptable to Regulatory Changes</h3>
                <p className="text-gray-600">
                  When new guidelines emerge, our system updates quickly, keeping your department compliant without disruption to your operations.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-ncaa-gold">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Prepared for Any Scenario</h3>
                <p className="text-gray-600">
                  Whether courts enforce Title IX in NIL, Congress passes new legislation, or states create their own rules, our flexible platform helps you navigate complexity with confidence.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-ncaa-lightblue">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data That Grows With You</h3>
                <p className="text-gray-600">
                  Our system continuously collects and organizes your NIL and revenue-sharing data, building a robust historical record that provides strategic insights regardless of regulatory shifts.
                </p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Main visual - Interactive Dashboard Mockup */}
              <div className="relative z-20 rounded-lg shadow-xl overflow-hidden bg-white p-4">
                <div className="rounded-md bg-gray-50 shadow-inner p-3">
                  {/* Header with title and date selector */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-ncaa-darkblue">Compliance Dashboard</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-500">2023-2024</div>
                      <svg className="h-4 w-4 text-ncaa-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Compliance Score Card */}
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">Current Compliance Status</div>
                      <div className="text-sm text-green-600 font-semibold">Up-to-date</div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-ncaa-blue rounded-full" style={{width: '94%'}}></div>
                    </div>
                    
                    <div className="flex justify-between mt-1">
                      <div className="text-xs text-gray-500">Last updated: Today</div>
                      <div className="text-xs font-medium text-ncaa-blue">94% compliant</div>
                    </div>
                  </div>
                  
                  {/* Regulatory Changes Timeline */}
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                    <div className="text-sm font-medium mb-3">Regulatory Timeline</div>
                    <div className="space-y-3">
                      {/* Timeline items */}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 rounded-full bg-ncaa-blue mt-1"></div>
                        <div className="ml-2">
                          <div className="text-xs font-medium">New NCAA Guidelines</div>
                          <div className="text-xs text-gray-500">Effective Oct 2023</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 rounded-full bg-ncaa-gold mt-1"></div>
                        <div className="ml-2">
                          <div className="text-xs font-medium">Federal Legislation</div>
                          <div className="text-xs text-gray-500">Pending (Q1 2024)</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 rounded-full bg-gray-300 mt-1"></div>
                        <div className="ml-2">
                          <div className="text-xs font-medium">State Law Updates</div>
                          <div className="text-xs text-gray-500">Upcoming (Q2 2024)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-ncaa-blue text-white text-xs py-2 rounded-md shadow-sm">Update Now</button>
                    <button className="flex-1 bg-white text-ncaa-blue text-xs py-2 rounded-md shadow-sm border border-ncaa-blue">View Report</button>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-12 -right-8 w-28 h-28 bg-ncaa-gold/20 rounded-full filter blur-xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-ncaa-blue/20 rounded-full filter blur-xl -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-ncaa-lightblue/20 rounded-full filter blur-xl -z-10"></div>
              
              {/* Floating elements to show adaptability */}
              <div className="absolute top-0 right-0 animate-pulse z-10">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-12 animate-bounce z-10" style={{animationDuration: '3s'}}>
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <svg className="h-5 w-5 text-ncaa-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-4 animate-pulse z-10" style={{animationDuration: '4s', animationDelay: '1s'}}>
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <svg className="h-5 w-5 text-ncaa-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 