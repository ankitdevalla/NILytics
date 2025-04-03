'use client'

import React from 'react'
import FileUpload from '@/components/forms/FileUpload'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              NIL Compliance Dashboard
            </h1>
            <p className="text-gray-600 mb-6">
              Upload payment data to analyze NIL compliance and generate reports.
            </p>
            
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  )
} 