'use client';

import React from 'react';
import Link from 'next/link';

export default function DemoRequestSummary() {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 bg-gray-50">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Demo Request System Overview
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          How the demo request and notification system works
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              User Submission
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              Users can submit a demo request through the "Book a Demo" form on the landing page. 
              Required fields include name, email, and institution.
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Data Storage
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              Demo requests are stored in the Supabase <code>demo_requests</code> table if it exists.
              If the table doesn't exist, requests are stored in the browser's localStorage as a fallback.
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Email Notifications
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              When a user submits a demo request, an email notification is sent via the Mailgun API.
              The notification contains all details from the request form.
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Admin Panel
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              This page displays all submitted demo requests with options to contact users directly.
              It's currently accessible at <code>/admin/demo-requests</code> without authentication.
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Security Notes
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <p className="mb-2">
                <strong>For production deployment:</strong> The admin panel should be secured with authentication.
                The API key is currently exposed in a NEXT_PUBLIC_ variable, which should be changed to a server-side variable.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-ncaa-blue bg-ncaa-blue bg-opacity-10 hover:bg-opacity-20"
              >
                Dashboard
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
} 