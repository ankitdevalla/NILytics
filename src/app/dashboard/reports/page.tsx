'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Athlete, Sport, Payment, fetchAthletesWithSport, fetchPaymentsWithDetails } from '@/lib/supabase'

interface ReportType {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

interface SavedReport {
  id: string
  name: string
  type: string
  createdAt: string
  status: 'ready' | 'generating'
  downloadUrl?: string
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate')
  const [selectedReportType, setSelectedReportType] = useState<string>('')
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year' | 'custom'>('month')
  const [format, setFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const [savedReports, setSavedReports] = useState<SavedReport[]>([
    {
      id: '1',
      name: 'Title IX Compliance - Q1 2024',
      type: 'compliance',
      createdAt: '2024-04-01T14:30:00Z',
      status: 'ready',
      downloadUrl: '#'
    },
    {
      id: '2',
      name: 'Athlete Payment Summary - March 2024',
      type: 'payment',
      createdAt: '2024-04-05T09:15:00Z',
      status: 'ready',
      downloadUrl: '#'
    },
    {
      id: '3',
      name: 'Gender Equity Analysis - 2023-2024',
      type: 'gender',
      createdAt: '2024-04-10T16:45:00Z',
      status: 'generating'
    }
  ])

  const reportTypes: ReportType[] = [
    {
      id: 'compliance',
      name: 'Title IX Compliance Report',
      description: 'Comprehensive analysis of your institution\'s Title IX compliance status for NIL payments.',
      icon: (
        <svg className="h-8 w-8 text-ncaa-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 'payment',
      name: 'Athlete Payment Summary',
      description: 'Detailed breakdown of all NIL payments to athletes sorted by amount, date, or sport.',
      icon: (
        <svg className="h-8 w-8 text-ncaa-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'sport',
      name: 'Sport-by-Sport Analysis',
      description: 'Compare NIL payment distribution across different sports in your athletic program.',
      icon: (
        <svg className="h-8 w-8 text-ncaa-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'gender',
      name: 'Gender Equity Analysis',
      description: 'Analyze payment distribution between male and female athletes with trend analysis.',
      icon: (
        <svg className="h-8 w-8 text-ncaa-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ]

  const handleGenerateReport = () => {
    if (!selectedReportType) {
      alert('Please select a report type')
      return
    }
    
    setIsLoading(true)
    
    // Simulate report generation
    setTimeout(() => {
      const newReport: SavedReport = {
        id: Date.now().toString(),
        name: `${reportTypes.find(r => r.id === selectedReportType)?.name} - ${new Date().toLocaleDateString()}`,
        type: selectedReportType,
        createdAt: new Date().toISOString(),
        status: 'generating'
      }
      
      setSavedReports([newReport, ...savedReports])
      setIsLoading(false)
      setActiveTab('saved')
      
      // Simulate report completion after 3 seconds
      setTimeout(() => {
        setSavedReports(prev => 
          prev.map(report => 
            report.id === newReport.id 
              ? { ...report, status: 'ready', downloadUrl: '#' } 
              : report
          )
        )
      }, 3000)
    }, 1500)
  }
  
  const getDateRangeLabel = () => {
    const now = new Date()
    
    switch(dateRange) {
      case 'month':
        return `Past 30 days (${new Date(now.setDate(now.getDate() - 30)).toLocaleDateString()} - ${new Date().toLocaleDateString()})`
      case 'quarter':
        return `Past 90 days (${new Date(now.setDate(now.getDate() - 90)).toLocaleDateString()} - ${new Date().toLocaleDateString()})`
      case 'year':
        return `Past year (${new Date(now.setFullYear(now.getFullYear() - 1)).toLocaleDateString()} - ${new Date().toLocaleDateString()})`
      case 'custom':
        return customStartDate && customEndDate 
          ? `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
          : 'Select custom dates'
      default:
        return 'Select date range'
    }
  }
  
  const getFormatLabel = () => {
    switch(format) {
      case 'pdf':
        return 'PDF Document (.pdf)'
      case 'csv':
        return 'Comma Separated Values (.csv)'
      case 'excel':
        return 'Excel Spreadsheet (.xlsx)'
      default:
        return 'Select format'
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate, view, and download reports for your athletic program
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-8">
        <div className="sm:hidden">
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-ncaa-blue focus:ring-ncaa-blue"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as 'generate' | 'saved')}
          >
            <option value="generate">Generate Report</option>
            <option value="saved">Saved Reports</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('generate')}
                className={`${
                  activeTab === 'generate'
                    ? 'border-ncaa-blue text-ncaa-blue'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Generate Report
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`${
                  activeTab === 'saved'
                    ? 'border-ncaa-blue text-ncaa-blue'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Saved Reports
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Generate Report Tab */}
      {activeTab === 'generate' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Create a New Report</h2>
          
          {/* Report Types */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReportType(report.id)}
                  className={`${
                    selectedReportType === report.id 
                      ? 'border-ncaa-blue ring-2 ring-ncaa-blue/30' 
                      : 'border-gray-200 hover:border-gray-300'
                  } cursor-pointer rounded-lg border p-4 transition-all`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">{report.icon}</div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-gray-900">{report.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Report Settings */}
          {selectedReportType && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div className="mt-1 rounded-md shadow-sm border border-gray-300 overflow-hidden">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as any)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-0 focus:outline-none focus:ring-0 sm:text-sm"
                    >
                      <option value="month">Past 30 days</option>
                      <option value="quarter">Past 90 days</option>
                      <option value="year">Past year</option>
                      <option value="custom">Custom range</option>
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{getDateRangeLabel()}</p>
                  
                  {/* Custom Date Range */}
                  {dateRange === 'custom' && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Start Date</label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">End Date</label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                  <div className="mt-1 rounded-md shadow-sm border border-gray-300 overflow-hidden">
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as any)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-0 focus:outline-none focus:ring-0 sm:text-sm"
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="csv">CSV (Spreadsheet)</option>
                      <option value="excel">Excel</option>
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{getFormatLabel()}</p>
                </div>
              </div>
              
              {/* Advanced Options (simplified for demo) */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">Advanced Options</h3>
                  <button
                    type="button"
                    className="text-sm text-ncaa-blue font-medium hover:text-ncaa-darkblue"
                  >
                    Customize Report
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <input
                      id="include-charts"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-ncaa-blue focus:ring-ncaa-blue border-gray-300 rounded"
                    />
                    <label htmlFor="include-charts" className="ml-2 block text-sm text-gray-700">
                      Include visualization charts
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="include-recommendations"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-ncaa-blue focus:ring-ncaa-blue border-gray-300 rounded"
                    />
                    <label htmlFor="include-recommendations" className="ml-2 block text-sm text-gray-700">
                      Include recommendations
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="include-raw-data"
                      type="checkbox"
                      className="h-4 w-4 text-ncaa-blue focus:ring-ncaa-blue border-gray-300 rounded"
                    />
                    <label htmlFor="include-raw-data" className="ml-2 block text-sm text-gray-700">
                      Include raw data tables
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Generate Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Saved Reports Tab */}
      {activeTab === 'saved' && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">Recent Reports</h2>
              <Link 
                href="#" 
                className="text-sm text-ncaa-blue font-medium hover:text-ncaa-darkblue"
              >
                View all reports
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedReports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No reports found. Generate a new report to get started.
                      </td>
                    </tr>
                  ) : (
                    savedReports.map((report) => (
                      <tr key={report.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {reportTypes.find(t => t.id === report.type)?.name || report.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(report.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {report.status === 'ready' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Ready
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Generating...
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {report.status === 'ready' ? (
                            <div className="flex justify-end space-x-3">
                              <Link 
                                href={report.downloadUrl || '#'} 
                                className="text-ncaa-blue hover:text-ncaa-darkblue"
                                download
                              >
                                Download
                              </Link>
                              <button className="text-gray-500 hover:text-gray-700">
                                Share
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">Processing...</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Schedule Reports Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Scheduled Reports</h2>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue">
                <svg className="-ml-1 mr-1 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Schedule New
              </button>
            </div>
            
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="bg-gray-50 px-6 py-3 text-center">
                <p className="text-sm text-gray-500">No scheduled reports. Set up recurring reports to receive them automatically.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 