import React from 'react'
import Link from 'next/link'

const pricingPlans = [
  {
    name: 'Starter',
    price: '$199',
    period: '/month',
    description: 'Perfect for small athletic departments just getting started with NIL management.',
    features: [
      'Basic compliance checks',
      'Up to 50 athlete profiles',
      'Email alerts for compliance issues',
      'Monthly summary reports',
      'Basic document storage',
      'Email support'
    ],
    cta: 'Get started',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$299',
    period: '/month',
    description: 'Ideal for mid-sized athletic departments requiring more robust compliance tools.',
    features: [
      'Advanced compliance checks',
      'Up to 200 athlete profiles',
      'Real-time alerts and notifications',
      'Custom reporting dashboards',
      'Advanced document management',
      'Priority email support'
    ],
    cta: 'Get started',
    highlighted: true
  }
]

export default function PricingTable() {
  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h2 className="text-3xl font-bold tracking-tight text-ncaa-darkblue sm:text-4xl text-center">
            Pricing Plans for Every Athletic Department
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 text-center">
            Choose the plan that works best for your institution's size and compliance needs.
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-auto xl:max-w-4xl xl:grid-cols-2">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`lando-card flex flex-col rounded-2xl shadow-sm divide-y divide-gray-200 ${
                plan.highlighted 
                  ? 'border-2 border-ncaa-blue relative overflow-visible' 
                  : 'border border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 right-6 bg-ncaa-blue text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
                  Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">{plan.period}</span>
                </div>
                <p className="mt-4 text-gray-600">{plan.description}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link 
                    href={plan.name === 'Enterprise' ? '#waitlist' : '#waitlist'} 
                    className={`block w-full text-center px-5 py-3 rounded-lg font-medium transition-all duration-200 ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-ncaa-blue to-ncaa-lightblue text-white hover:from-ncaa-darkblue hover:to-ncaa-blue shadow-md hover:shadow-lg' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-ncaa-blue'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-base text-gray-600">
            Need a custom solution? <Link href="#waitlist" className="font-medium text-ncaa-blue hover:text-ncaa-darkblue">Contact our sales team</Link> for a tailored package.
          </p>
        </div>
      </div>
    </section>
  )
} 