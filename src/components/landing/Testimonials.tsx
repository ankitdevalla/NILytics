import React from 'react'
import Image from 'next/image'

const testimonials = [
  {
    content: "This NIL compliance tool has completely transformed how we manage athlete endorsements. The automation and reporting features save us countless hours every month.",
    author: "Sarah Johnson",
    role: "Athletic Director, Pacific University",
    avatar: "/testimonial-avatar-1.png",
  },
  {
    content: "The dashboard provides instant visibility into our compliance status. With real-time alerts, we can address potential issues before they become problems.",
    author: "Michael Chen",
    role: "Compliance Officer, Eastern State",
    avatar: "/testimonial-avatar-2.png",
  },
  {
    content: "Implementation was smooth and the support team is incredibly responsive. This tool has become essential for our athletic department's operations.",
    author: "James Rodriguez",
    role: "Athletic Director, Western Tech",
    avatar: "/testimonial-avatar-3.png",
  },
]

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
            Trusted by Athletic Departments Nationwide
          </h2>
          <p className="mt-3 max-w-2xl text-xl text-gray-500 text-center">
            Hear what athletic directors and compliance officers are saying about our platform.
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="lando-card flex flex-col h-full p-8 border shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-lg text-gray-600 mb-4">{testimonial.content}</p>
              </div>
              <div className="flex items-center mt-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {testimonial.author.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 