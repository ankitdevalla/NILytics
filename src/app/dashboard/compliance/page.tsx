'use client'

import React, { useState, useEffect } from 'react'
import { 
  checkTitleIXCompliance, 
  getPaymentDistributionByGender, 
  getPaymentDistributionBySport,
  TitleIXComplianceResult,
  PaymentDistributionByGender,
  PaymentDistributionBySport
} from '@/lib/supabase'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Color constants
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const GENDER_COLORS = {
  Male: '#0088FE',
  Female: '#FF8042'
};

export default function CompliancePage() {
  const [complianceData, setComplianceData] = useState<TitleIXComplianceResult[]>([])
  const [genderDistribution, setGenderDistribution] = useState<PaymentDistributionByGender[]>([])
  const [sportDistribution, setSportDistribution] = useState<PaymentDistributionBySport[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<string>('year')
  const [complianceScore, setComplianceScore] = useState<number>(0)

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`
  }

  // Load data based on selected time range
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Calculate date range based on selected timeRange
        const endDate = new Date().toISOString()
        let startDate: string | undefined
        
        if (timeRange === 'month') {
          const lastMonth = new Date()
          lastMonth.setMonth(lastMonth.getMonth() - 1)
          startDate = lastMonth.toISOString()
        } else if (timeRange === 'quarter') {
          const lastQuarter = new Date()
          lastQuarter.setMonth(lastQuarter.getMonth() - 3)
          startDate = lastQuarter.toISOString()
        } else if (timeRange === 'year') {
          const lastYear = new Date()
          lastYear.setFullYear(lastYear.getFullYear() - 1)
          startDate = lastYear.toISOString()
        }
        
        // Fetch all required data
        const [complianceResults, genderResults, sportResults] = await Promise.all([
          checkTitleIXCompliance(startDate, endDate),
          getPaymentDistributionByGender(startDate, endDate),
          getPaymentDistributionBySport(startDate, endDate)
        ])
        
        // Update state with fetched data
        setComplianceData(complianceResults)
        setGenderDistribution(genderResults)
        setSportDistribution(sportResults)
        
        // Calculate compliance score
        calculateComplianceScore(complianceResults)
      } catch (err) {
        setError('Failed to load compliance data. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [timeRange])
  
  // Calculate overall compliance score
  const calculateComplianceScore = (data: TitleIXComplianceResult[]) => {
    if (!data || data.length === 0) {
      setComplianceScore(0)
      return
    }
    
    const compliantCount = data.filter(item => item.is_compliant).length
    const score = (compliantCount / data.length) * 100
    setComplianceScore(score)
  }
  
  // Prepare gender distribution data for charts
  const prepareGenderData = () => {
    if (!genderDistribution || genderDistribution.length === 0) {
      return []
    }
    
    return genderDistribution.map(item => ({
      name: item.gender,
      value: item.total_amount,
      count: item.payment_count
    }))
  }
  
  // Prepare sport distribution data for charts
  const prepareSportData = () => {
    if (!sportDistribution || sportDistribution.length === 0) {
      return []
    }
    
    return sportDistribution
      .sort((a, b) => b.total_amount - a.total_amount)
      .slice(0, 10)
      .map(item => ({
        name: item.sport_name || 'Unknown',
        amount: item.total_amount || 0,
        count: item.payment_count || 0
      }))
  }
  
  // Prepare compliance data for visualization
  const prepareComplianceData = () => {
    if (!complianceData || complianceData.length === 0) {
      return []
    }
    
    return complianceData.map(item => ({
      name: item.gender || 'Unknown',
      athletes: (item.athlete_percentage || 0) * 100,
      payments: (item.payment_percentage || 0) * 100,
      compliant: item.is_compliant || false
    }))
  }
  
  // Get compliance status and recommendations
  const getComplianceStatus = () => {
    if (complianceData.length === 0) return { status: 'Unknown', message: 'No data available' }
    
    const allCompliant = complianceData.every(item => item.is_compliant)
    
    if (allCompliant) {
      return { 
        status: 'Compliant', 
        message: 'Your NIL payment distribution is compliant with Title IX requirements.' 
      }
    }
    
    // Find the most out-of-balance gender
    const nonCompliant = complianceData.find(item => !item.is_compliant)
    
    if (nonCompliant) {
      const diff = Math.abs(nonCompliant.payment_percentage - nonCompliant.athlete_percentage)
      return {
        status: 'Non-Compliant',
        message: `Your NIL payment distribution for ${nonCompliant.gender} athletes is ${formatPercentage(diff)} off from their representation, which may not meet Title IX requirements.`
      }
    }
    
    return { status: 'Unknown', message: 'Unable to determine compliance status.' }
  }
  
  // Generate specific recommendations
  const getRecommendations = () => {
    if (complianceData.length === 0) return []
    
    const recommendations = []
    const allCompliant = complianceData.every(item => item.is_compliant)
    
    if (!allCompliant) {
      // Find gender with lower payment percentage compared to athlete percentage
      const underrepresented = complianceData.find(
        item => item.payment_percentage < item.athlete_percentage
      )
      
      if (underrepresented) {
        recommendations.push({
          title: `Increase NIL opportunities for ${underrepresented.gender} athletes`,
          description: `${underrepresented.gender} athletes represent ${formatPercentage(underrepresented.athlete_percentage)} of your athlete population but only receive ${formatPercentage(underrepresented.payment_percentage)} of NIL payments.`
        })
      }
      
      // Add recommendations based on sport distribution
      if (sportDistribution.length > 0) {
        // Find sports that might be unbalanced
        const topSports = sportDistribution.sort((a, b) => b.total_amount - a.total_amount).slice(0, 3)
        
        recommendations.push({
          title: 'Review NIL distribution across sports',
          description: `${topSports.map(s => s.sport_name).join(', ')} receive significantly more NIL payments than other sports. Consider promoting NIL opportunities in underrepresented sports.`
        })
      }
    }
    
    // Add general recommendations
    recommendations.push({
      title: 'Regular compliance monitoring',
      description: 'Continue to monitor NIL payment distribution on a quarterly basis to ensure ongoing Title IX compliance.'
    })
    
    recommendations.push({
      title: 'Document compliance efforts',
      description: 'Maintain detailed records of all initiatives aimed at ensuring equitable NIL opportunities across all genders and sports.'
    })
    
    return recommendations
  }
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('amount') ? formatCurrency(entry.value) : 
                entry.name === 'athletes' || entry.name === 'payments' ? `${entry.value.toFixed(1)}%` : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  
  // Calculate compliance status
  const complianceStatus = getComplianceStatus()
  const recommendations = getRecommendations()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Title IX Compliance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze and monitor Title IX compliance for NIL payments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">Time Range:</span>
          <select
            className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm rounded-md"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Compliance Score Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative w-36 h-36 mb-4 md:mb-0 md:mr-6">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={complianceScore >= 90 ? '#10B981' : complianceScore >= 70 ? '#FBBF24' : '#EF4444'}
                strokeWidth="3"
                strokeDasharray={`${complianceScore}, 100`}
                className="animate-dash"
              />
              <text x="18" y="20.5" textAnchor="middle" fontSize="7" fill="#374151" fontWeight="bold">
                {Math.round(complianceScore)}%
              </text>
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-bold text-gray-900 mr-2">Title IX Compliance Score</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                complianceScore >= 90 
                  ? 'bg-green-100 text-green-800' 
                  : complianceScore >= 70 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {complianceStatus.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {complianceStatus.message}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-4">
              <div className="border-r border-gray-200 pr-4">
                <p className="text-sm font-medium text-gray-500">Time Period</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {timeRange === 'month' ? 'Last Month' : 
                   timeRange === 'quarter' ? 'Last Quarter' : 
                   timeRange === 'year' ? 'Last Year' : 'All Time'}
                </p>
              </div>
              <div className="border-r border-gray-200 px-4">
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="pl-4">
                <p className="text-sm font-medium text-gray-500">Compliance Target</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">±5% Balance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gender Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-medium text-gray-700 mb-4">Gender Distribution Analysis</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareComplianceData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar name="% of Athletes" dataKey="athletes" fill="#8884d8" />
                <Bar name="% of NIL Payments" dataKey="payments" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-medium text-gray-700 mb-4">NIL Payment Distribution by Gender</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareGenderData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {prepareGenderData().map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS] || COLORS[0]} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sport Distribution Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-4">NIL Payment Distribution by Sport</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={prepareSportData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="amount" name="Total NIL Amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Recommendations to Improve Compliance</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-ncaa-blue text-white">
                  {index + 1}
                </div>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">{rec.title}</h4>
                <p className="mt-1 text-sm text-gray-500">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Title IX Compliance Action Plan</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm text-blue-800 font-medium">About Title IX Compliance</h4>
                <p className="text-sm text-blue-700 mt-2">
                  Title IX requires that NIL opportunities be made available to male and female student-athletes in a manner proportional to their participation. 
                  This doesn't mean equal amounts, but rather proportional to the gender breakdown of your athletic program.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Suggested Actions</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Conduct quarterly NIL opportunity audits across all sports and genders</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Develop targeted NIL workshops for underrepresented gender or sports</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Create a formal NIL opportunity equalization program within the athletic department</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Document all compliance efforts and maintain records for potential audits</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue">
              Generate Compliance Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 