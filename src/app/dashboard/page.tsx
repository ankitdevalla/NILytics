"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchDashboardStats } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Define types for dashboard stats
type PaymentStats = {
  total_payments: number;
  total_amount: number;
  avg_payment: number;
};

type AthleteByGender = {
  gender: string;
  count: number;
};

type PaymentByMonth = {
  month: string;
  total: number;
};

type SportStat = {
  sport_name: string;
  total_amount: number;
  athlete_count: number;
  payment_count: number;
};

type DashboardStats = {
  paymentStats: PaymentStats;
  athleteCountByGender: AthleteByGender[];
  paymentsByMonth: PaymentByMonth[];
  sportStats: SportStat[];
};

// Color constants
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log("Fetching dashboard stats...");

        // Add a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out")), 10000)
        );

        // Race between the actual fetch and the timeout
        const data = (await Promise.race([
          fetchDashboardStats(),
          timeoutPromise,
        ])) as Awaited<ReturnType<typeof fetchDashboardStats>>;

        console.log("Dashboard stats received:", data);
        setStats(data);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Transform month data for charts
  const prepareMonthlyData = () => {
    if (!stats?.paymentsByMonth || stats.paymentsByMonth.length === 0)
      return [];

    // Sort months chronologically
    return [...stats.paymentsByMonth]
      .sort((a, b) => {
        if (!a.month || !b.month) return 0;

        const [aYear, aMonth] = a.month.split("-");
        const [bYear, bMonth] = b.month.split("-");

        if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
        return parseInt(aMonth) - parseInt(bMonth);
      })
      .map((item) => ({
        ...item,
        month: item.month
          ? new Date(`${item.month}-01`).toLocaleString("default", {
              month: "short",
              year: "2-digit",
            })
          : "Unknown",
        total: parseFloat(item.total.toString()),
      }));
  };

  // Format the gender data for pie chart
  const prepareGenderData = () => {
    return (
      stats?.athleteCountByGender?.map((item) => ({
        name: item.gender,
        value: item.count,
      })) || []
    );
  };

  // Format sport stats for bar chart
  const prepareSportData = () => {
    console.log("DATA", stats?.sportStats);
    return (
      stats?.sportStats?.slice(0, 5)?.map((item) => ({
        name: item.sport_name || "Unknown",
        amount: parseFloat((item.total_amount || 0).toString()),
        athletes: item.athlete_count || 0,
      })) || []
    );
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name.includes("amount")
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Athletes</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats?.athleteCountByGender?.reduce(
              (sum, item) => sum + item.count,
              0
            ) || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">From all sports</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Payments</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats?.paymentStats?.total_payments || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Across all activities</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatCurrency(stats?.paymentStats?.total_amount || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">All time NIL payments</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Average Payment</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatCurrency(stats?.paymentStats?.avg_payment || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Per transaction</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      {prepareMonthlyData().length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Payments Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base font-medium text-gray-700 mb-4">
              Monthly Payment Trend
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareMonthlyData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Amount"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sport Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base font-medium text-gray-700 mb-4">
              Top Sports by NIL Amount
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareSportData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="amount" name="Total Amount" fill="#8884d8" />
                  <Bar dataKey="athletes" name="Athlete Count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="text-center py-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No data available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There is no payment data to display charts. Add some athletes and
              payments to see visualizations.
            </p>
          </div>
        </div>
      )}

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gender Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-medium text-gray-700 mb-4">
            Athlete Gender Distribution
          </h3>
          <div className="h-64">
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
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {prepareGenderData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 col-span-1 lg:col-span-2">
          <h3 className="text-base font-medium text-gray-700 mb-4">
            Title IX Compliance Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Payment Distribution</p>
                <p className="text-sm text-gray-500">
                  Payment distribution across genders is equitable
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Athlete Count Balance</p>
                <p className="text-sm text-gray-500">
                  Distribution may need review
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Participation Rate</p>
                <p className="text-sm text-gray-500">
                  Participation across sports is balanced
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Per-Sport Analysis</p>
                <p className="text-sm text-gray-500">
                  Some sports need payment equalization
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href="/dashboard/compliance"
              className="text-ncaa-blue hover:text-ncaa-darkblue font-medium flex items-center"
            >
              View detailed compliance report
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <h3 className="text-base font-medium text-gray-700 mb-2">
            Manage Athletes
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            View or edit athlete profiles and their payment history.
          </p>
          <Link
            href="/dashboard/athletes"
            className="text-ncaa-blue hover:text-ncaa-darkblue font-medium flex items-center text-sm"
          >
            View Athletes
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <h3 className="text-base font-medium text-gray-700 mb-2">
            Manage Payments
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            View, add, or edit payment records for NIL activities.
          </p>
          <Link
            href="/dashboard/payments"
            className="text-ncaa-blue hover:text-ncaa-darkblue font-medium flex items-center text-sm"
          >
            View Payments
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <h3 className="text-base font-medium text-gray-700 mb-2">
            Compliance Analysis
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Check Title IX compliance status and recommendations.
          </p>
          <Link
            href="/dashboard/compliance"
            className="text-ncaa-blue hover:text-ncaa-darkblue font-medium flex items-center text-sm"
          >
            View Compliance
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
