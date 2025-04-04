'use client'

import React from 'react'
import Link from 'next/link'

interface ComplianceItem {
  id: string
  title: string
  status: 'compliant' | 'warning' | 'violation'
  description: string
  recommendation?: string
}

function ComplianceCard({ item }: { item: ComplianceItem }) {
  const statusColors = {
    compliant: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    violation: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  }

  return (
    <div className={`p-6 rounded-lg border ${statusColors[item.status].border} ${statusColors[item.status].bg}`}>
      <div className="flex items-center mb-4">
        <div className="mr-3">
          {statusColors[item.status].icon}
        </div>
        <h3 className={`text-lg font-medium ${statusColors[item.status].text}`}>{item.title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{item.description}</p>
      {item.recommendation && (
        <div className="bg-white p-4 rounded-md border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-1">Recommendation:</p>
          <p className="text-sm text-gray-600">{item.recommendation}</p>
        </div>
      )}
    </div>
  )
}

export default function CompliancePage() {
  const complianceItems: ComplianceItem[] = [
    {
      id: 'proportionality',
      title: 'Athletic Participation Proportionality',
      status: 'compliant',
      description: 'The ratio of male to female athletes (46% male / 54% female) closely matches enrollment demographics (45% male / 55% female).',
    },
    {
      id: 'financial-aid',
      title: 'Financial Aid Distribution',
      status: 'warning',
      description: 'Financial aid distribution between male and female athletes is approaching the allowable 1% variance threshold.',
      recommendation: 'Review scholarship distribution for the upcoming year to ensure equitable allocation of financial aid resources.',
    },
    {
      id: 'nil-payments',
      title: 'NIL Payment Distribution',
      status: 'violation',
      description: 'Male athletes are receiving 76% of total NIL payments while representing only 46% of the athlete population.',
      recommendation: 'Develop and implement a plan to promote more NIL opportunities for female athletes. Consider partnerships with brands that target female demographics.',
    },
    {
      id: 'facilities',
      title: 'Athletic Facilities',
      status: 'compliant',
      description: 'Equal quality facilities are provided for both male and female athletes across all sports.',
    },
    {
      id: 'equipment',
      title: 'Equipment and Supplies',
      status: 'compliant',
      description: 'Equitable distribution of equipment and supplies between male and female sports programs.',
    },
    {
      id: 'coaching',
      title: 'Coaching Availability',
      status: 'warning',
      description: 'There is a slight disparity in the coach-to-athlete ratio between men\'s and women\'s teams.',
      recommendation: 'Consider adding additional coaching staff to women\'s basketball and volleyball programs.',
    },
  ]

  const complianceStats = {
    overall: {
      score: 83,
      change: -4
    },
    issues: {
      compliant: 3,
      warning: 2,
      violation: 1
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Title IX Compliance Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and improve your compliance with Title IX regulations
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue">
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Compliance Report
          </button>
        </div>
      </div>

      {/* Compliance Score Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Overall Compliance Score</h3>
            <p className="mt-1 text-sm text-gray-500">Based on analysis of 6 Title IX compliance factors</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-baseline">
              <p className="text-4xl font-bold text-gray-900">{complianceStats.overall.score}/100</p>
              <p className={`ml-2 text-sm font-medium ${complianceStats.overall.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {complianceStats.overall.change >= 0 ? '+' : ''}{complianceStats.overall.change} pts
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="h-3 relative max-w-xl rounded-full overflow-hidden">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div
              className={`h-full ${complianceStats.overall.score >= 90 ? 'bg-green-500' : complianceStats.overall.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'} absolute`}
              style={{ width: `${complianceStats.overall.score}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-5 border-t border-gray-200 pt-5">
          <div>
            <dt className="text-sm font-medium text-green-600">Compliant</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{complianceStats.issues.compliant}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-yellow-600">Warnings</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{complianceStats.issues.warning}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-red-600">Violations</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{complianceStats.issues.violation}</dd>
          </div>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="space-y-6">
        {complianceItems.map((item) => (
          <ComplianceCard key={item.id} item={item} />
        ))}
      </div>

      {/* Recommendations */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Action Plan</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 relative mt-1">
              <span className="absolute h-full w-full rounded-full bg-ncaa-blue opacity-50 animate-ping"></span>
              <span className="relative block h-full w-full rounded-full bg-ncaa-blue"></span>
            </div>
            <div className="ml-3">
              <h4 className="text-base font-medium text-gray-900">High Priority: Address NIL Payment Distribution</h4>
              <p className="mt-1 text-sm text-gray-500">Current distribution could lead to Title IX compliance issues.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 bg-yellow-500 rounded-full mt-1"></div>
            <div className="ml-3">
              <h4 className="text-base font-medium text-gray-900">Medium Priority: Review Financial Aid Distribution</h4>
              <p className="mt-1 text-sm text-gray-500">Monitor and adjust scholarship distribution for next year.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 bg-yellow-500 rounded-full mt-1"></div>
            <div className="ml-3">
              <h4 className="text-base font-medium text-gray-900">Medium Priority: Address Coaching Availability</h4>
              <p className="mt-1 text-sm text-gray-500">Evaluate coaching needs for women's sports programs.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Link 
            href="/dashboard/compliance/action-plan"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue"
          >
            View Detailed Action Plan
          </Link>
        </div>
      </div>
    </div>
  )
} 