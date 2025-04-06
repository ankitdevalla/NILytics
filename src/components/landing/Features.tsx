import React from 'react'

const features = [
  {
    title: 'Real-Time NIL & Revenue Sharing Analytics',
    description: 'Monitor every NIL deal and revenue-sharing payment in real time — ensuring your department stays ahead of compliance requirements, state mandates, and best-practice standards.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: 'Equity Transparency Dashboard',
    description: 'Showcase your commitment to fairness with our customizable Equity Transparency Dashboard. Track payment disparities by gender and sport, even when Title IX isn\'t enforced, and use these insights to enhance your program\'s public image and athlete support.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Compliance & Audit-Readiness Tools',
    description: 'Automated reporting, secure digital records, and audit trails help you stay prepared for evolving NCAA and state regulations.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
]

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-blue-50 opacity-70 -z-10"></div>
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-ncaa-lightblue/10 rounded-full filter blur-3xl opacity-70 -z-10"></div>
      <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-ncaa-blue/10 rounded-full filter blur-3xl opacity-70 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="inline-block text-sm font-semibold uppercase tracking-wide text-ncaa-blue bg-blue-50 px-3 py-1 rounded-full mb-4">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ncaa-darkblue mb-6">
            NILytics: Powerful Tools for the New Era
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage NIL payments and revenue sharing in one powerful analytics platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 animate-fadeIn overflow-hidden" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-ncaa-blue/5 to-ncaa-lightblue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              
              {/* Top decorator */}
              <div className="absolute top-0 right-0 h-2 w-full bg-gradient-to-r from-ncaa-blue to-ncaa-lightblue transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="flex flex-col h-full">
                <div className="p-3 mb-6 inline-flex items-center justify-center bg-ncaa-blue/10 rounded-xl text-ncaa-blue group-hover:bg-ncaa-blue group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-ncaa-blue transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 flex-grow">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-ncaa-blue font-medium">
                  <span className="group-hover:mr-2 transition-all duration-300">Learn more</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block p-0.5 rounded-lg bg-gradient-to-r from-ncaa-blue to-ncaa-lightblue shadow-lg">
            <button className="bg-white hover:bg-gray-50 transition-colors text-ncaa-blue font-semibold py-3 px-6 rounded-md">
              Learn more about our features
            </button>
          </div>
        </div>
      </div>
    </section>
  )
} 