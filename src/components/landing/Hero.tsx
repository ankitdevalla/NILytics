'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="py-6 md:py-12">
      <div className="lando-card overflow-visible bg-white/90 backdrop-blur-sm">
        <div className="relative px-6 py-10 sm:px-12 lg:px-16">
          <div className="relative">
            <div className="absolute -top-10 -left-8 w-20 h-20 bg-ncaa-lightblue/20 rounded-full filter blur-xl opacity-70"></div>
            <div className="absolute -bottom-20 -right-10 w-32 h-32 bg-ncaa-blue/20 rounded-full filter blur-xl opacity-70"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ncaa-darkblue mb-6 leading-tight">
                  Empower Your Athletic Department in the New Era of NIL & Revenue Sharing
                </h1>
                <div className="p-6 rounded-xl bg-gradient-to-r from-ncaa-blue to-ncaa-lightblue text-white shadow-lg mb-8">
                  <p className="text-xl font-medium mb-4">
                    Data-Driven Insights for Transparent Athlete Compensation and Equity — Today and Tomorrow
                  </p>
                </div>

                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="#demo"
                    className="rounded-md bg-ncaa-blue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ncaa-darkblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ncaa-blue"
                  >
                    Schedule a Demo
                  </a>
                  <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              <div className="relative z-10">
                <div className="w-full aspect-square relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="lando-3d-element h-24 sm:h-32 w-full bg-gradient-to-br from-ncaa-lightblue to-ncaa-blue rounded-xl shadow-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div className="lando-3d-element h-24 sm:h-32 w-full bg-gradient-to-br from-ncaa-blue to-ncaa-darkblue rounded-xl shadow-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div className="lando-3d-element h-24 sm:h-32 w-full bg-gradient-to-br from-ncaa-gold to-yellow-500 rounded-xl shadow-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="lando-3d-element h-24 sm:h-32 w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-ncaa-darkblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 3D Character */}
                  <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                    <div className="w-20 h-20 bg-gradient-to-br from-ncaa-lightblue to-ncaa-blue rounded-full shadow-lg flex items-center justify-center animate-bounce-slow">
                      <div className="w-10 h-10 bg-white rounded-full shadow-inner"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
} 