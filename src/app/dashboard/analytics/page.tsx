"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@/lib/auth";
import AccumulatedPaymentsChart from "@/components/charts/AccumulatedPaymentsChart";
import SportDistributionPieChart from "@/components/charts/SportDistributionPieChart";
import GenderDistributionPieChart from "@/components/charts/GenderDistributionPieChart";
import TopEarnersChart from "@/components/charts/TopEarnersChart";
import PaymentSourcesChart from "@/components/charts/PaymentSourcesChart";
import SpendingLimitsChart from "@/components/charts/SpendingLimitsChart";

// Define Payment type
interface Payment {
  id: string;
  athlete_id: string;
  athlete_name: string;
  amount: number;
  date: string;
  sport_id: string;
  source: string;
}

// Define Athlete type
interface Athlete {
  id: string;
  name: string;
  gender: string;
  sport_id: string;
  // Add other athlete fields as needed
}

// Define Sport type
interface Sport {
  id: string;
  name: string;
}

interface SportData {
  sport_id: string;
  sport_name: string;
  total_amount: number;
  payment_count: number;
}

// Define SpendingLimit type
interface SpendingLimit {
  id: string;
  sport_id: string;
  sport_name: string;
  limit_amount: number;
  period: "monthly" | "quarterly" | "yearly";
  created_at: string;
  updated_at: string;
}

// Chart placeholder component
function AnalyticsChart({
  title,
  description,
  height = "h-64",
}: {
  title: string;
  description: string;
  height?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <div
        className={`${height} bg-gradient-to-br from-gray-50 to-gray-100 rounded-md flex items-center justify-center border border-gray-200`}
      >
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            Chart visualization will appear here
          </p>
        </div>
      </div>
    </div>
  );
}

// Analytics card with value metric
function MetricCard({
  title,
  value,
  change,
  icon,
  color = "blue",
}: {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
}) {
  const isPositive = change && !change.startsWith("-");
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-2">
        <div
          className={`h-10 w-10 rounded-full ${colorClasses[color]} flex items-center justify-center`}
        >
          {icon}
        </div>
        <h3 className="ml-3 text-base font-medium text-gray-900">{title}</h3>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {change}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isPositive
                    ? "M5 10l7-7m0 0l7 7m-7-7v18"
                    : "M19 14l-7 7m0 0l-7-7m7 7V3"
                }
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// Filter component
function AnalyticsFilter({
  timePeriod,
  setTimePeriod,
  sports,
  selectedSport,
  setSelectedSport,
}: {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
  sports: Sport[];
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
}) {
  const filters = [
    { id: "all", name: "All Sports" },
    ...sports.map((sport) => ({
      id: sport.id,
      name: sport.name,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-gray-700">Filter by:</span>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedSport(filter.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              selectedSport === filter.id
                ? "bg-ncaa-blue text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>
      <div className="ml-auto">
        <select
          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        >
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="12months">Last 12 months</option>
          <option value="all">All time</option>
        </select>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const supabase = createClientComponentClient();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [spendingLimits, setSpendingLimits] = useState<SpendingLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<string>("30days");
  const [selectedSport, setSelectedSport] = useState<string>("all");

  // Format currency helper function
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Filter payments based on the selected time period and sport
  const getFilteredPayments = () => {
    if (!payments.length) return [];

    const now = new Date();
    let startDate = new Date();

    switch (timePeriod) {
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
      case "12months":
        startDate.setMonth(now.getMonth() - 12);
        break;
      case "all":
      default:
        startDate = new Date(0); // Start from beginning of time
    }

    return payments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      const isInTimeRange = paymentDate >= startDate && paymentDate <= now;

      if (selectedSport === "all") {
        return isInTimeRange;
      }

      // Get the athlete's sport_id
      const athlete = athletes.find((a) => a.id === payment.athlete_id);
      return isInTimeRange && athlete?.sport_id === selectedSport;
    });
  };

  // Calculate average payment
  const averagePayment = useMemo(() => {
    const filteredPayments = getFilteredPayments();
    if (!filteredPayments.length) return 0;
    const total = filteredPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return total / filteredPayments.length;
  }, [payments, timePeriod, selectedSport]);

  // Calculate total unique athletes with NIL payments
  const totalAthletesWithNIL = useMemo(() => {
    const filteredPayments = getFilteredPayments();
    const uniqueAthleteIds = new Set(
      filteredPayments.map((payment) => payment.athlete_id)
    );
    return uniqueAthleteIds.size;
  }, [payments, timePeriod, selectedSport]);

  // Calculate percentage change in athletes with NIL
  const calculateAthletePercentageChange = () => {
    if (!payments.length) return "0%";

    // Get current month's payments
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      );
    });

    // Get previous month's payments
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const previousMonthPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate.getMonth() === previousMonth &&
        paymentDate.getFullYear() === previousYear
      );
    });

    // Calculate unique athletes for each period
    const currentAthletes = new Set(
      currentMonthPayments.map((p) => p.athlete_id)
    ).size;
    const previousAthletes = new Set(
      previousMonthPayments.map((p) => p.athlete_id)
    ).size;

    // Calculate percentage change
    if (previousAthletes === 0) return currentAthletes > 0 ? "+100%" : "0%";
    const change =
      ((currentAthletes - previousAthletes) / previousAthletes) * 100;
    return `${change >= 0 ? "+" : ""}${Math.round(change)}%`;
  };

  // Calculate percentage change from previous period
  const calculatePercentageChange = () => {
    if (!payments.length) return "0%";

    // Get current month's payments
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      );
    });

    // Get previous month's payments
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const previousMonthPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate.getMonth() === previousMonth &&
        paymentDate.getFullYear() === previousYear
      );
    });

    // Calculate averages
    const currentAvg = currentMonthPayments.length
      ? currentMonthPayments.reduce((sum, p) => sum + p.amount, 0) /
        currentMonthPayments.length
      : 0;

    const previousAvg = previousMonthPayments.length
      ? previousMonthPayments.reduce((sum, p) => sum + p.amount, 0) /
        previousMonthPayments.length
      : 0;

    // Calculate percentage change
    if (previousAvg === 0) return currentAvg > 0 ? "+100%" : "0%";
    const change = ((currentAvg - previousAvg) / previousAvg) * 100;
    return `${change >= 0 ? "+" : ""}${Math.round(change)}%`;
  };

  const metrics = [
    {
      title: "Average NIL Payment",
      value: formatCurrency(averagePayment),
      change: calculatePercentageChange(),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "blue" as const,
    },
    {
      title: "Total Athletes with NIL",
      value: totalAthletesWithNIL.toString(),
      change: calculateAthletePercentageChange(),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      color: "green" as const,
    },
    {
      title: "Compliance Risk Score",
      value: "92%",
      change: "-3% vs previous period",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524 1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "red" as const,
    },
    {
      title: "Gender Payment Variance",
      value: "9.2%",
      change: "-5.1% vs previous period",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "purple" as const,
    },
  ];

  const getFilteredPaymentsBySport = (payments: Payment[]): SportData[] => {
    // Create a map to store payment data by sport
    const sportMap = new Map<string, SportData>();

    // Create a map of athlete IDs to their sport_id
    const athleteSportMap = new Map<string, string>();
    athletes.forEach((athlete) => {
      athleteSportMap.set(athlete.id, athlete.sport_id);
    });

    // Process each payment
    payments.forEach((payment) => {
      // Get sport_id using athlete_id
      const sportId = athleteSportMap.get(payment.athlete_id);
      if (!sportId) return; // Skip if no sport_id found

      const existing = sportMap.get(sportId);
      if (existing) {
        existing.total_amount += payment.amount;
        existing.payment_count += 1;
      } else {
        // Find the sport name from the sports array
        const sport = sports.find((s) => s.id === sportId);
        sportMap.set(sportId, {
          sport_id: sportId,
          sport_name: sport?.name || "Unknown Sport",
          total_amount: payment.amount,
          payment_count: 1,
        });
      }
    });

    return Array.from(sportMap.values());
  };

  const getFilteredPaymentsByGender = () => {
    // Get payments filtered by the selected time period
    const filteredPayments = getFilteredPayments();

    // Create a map to store payment data by gender
    const genderMap: Record<
      string,
      { total_amount: number; payment_count: number }
    > = {};

    // Create a map of athlete IDs to their gender
    const athleteGenderMap: Record<string, string> = {};
    athletes.forEach((athlete) => {
      athleteGenderMap[athlete.id] = athlete.gender;
    });

    // Process each filtered payment
    filteredPayments.forEach((payment) => {
      // Get athlete gender using athlete_id
      let gender = athleteGenderMap[payment.athlete_id] || "Unknown";

      // For demo purposes, if gender is not available, assign randomly
      if (gender === "Unknown") {
        gender = ["Male", "Female"][Math.floor(Math.random() * 2)];
      }

      // Initialize gender entry if it doesn't exist
      if (!genderMap[gender]) {
        genderMap[gender] = {
          total_amount: 0,
          payment_count: 0,
        };
      }

      // Update gender data
      genderMap[gender].total_amount += payment.amount;
      genderMap[gender].payment_count += 1;
    });

    // Convert map to array format required by GenderDistributionPieChart
    return Object.entries(genderMap).map(([gender, data]) => ({
      gender,
      total_amount: data.total_amount,
      payment_count: data.payment_count,
    }));
  };

  const getTopEarners = () => {
    // Get payments filtered by the selected time period and sport
    const filteredPayments = getFilteredPayments();

    // Create a map to store total payments by athlete
    const athletePayments: Record<string, { name: string; total: number }> = {};

    // Process each payment
    filteredPayments.forEach((payment) => {
      const athlete = athletes.find((a) => a.id === payment.athlete_id);
      if (!athlete) return;

      if (!athletePayments[payment.athlete_id]) {
        athletePayments[payment.athlete_id] = {
          name: athlete.name,
          total: 0,
        };
      }

      athletePayments[payment.athlete_id].total += payment.amount;
    });

    // Convert to array and sort by total amount
    const sortedEarners = Object.values(athletePayments)
      .sort((a, b) => b.total - a.total)
      .slice(0, 3); // Get top 3

    return sortedEarners.map((earner) => ({
      athlete_name: earner.name,
      total_amount: earner.total,
    }));
  };

  const getPaymentSources = () => {
    // Get payments filtered by the selected time period and sport
    const filteredPayments = getFilteredPayments();

    // Create a map to store payment data by source
    const sourceMap: Record<
      string,
      { total_amount: number; payment_count: number }
    > = {};

    // Process each payment
    filteredPayments.forEach((payment) => {
      const source = payment.source || "Unknown";
      if (!sourceMap[source]) {
        sourceMap[source] = {
          total_amount: 0,
          payment_count: 0,
        };
      }

      sourceMap[source].total_amount += payment.amount;
      sourceMap[source].payment_count += 1;
    });

    // Convert to array format required by PaymentSourcesChart
    return Object.entries(sourceMap).map(([source_name, data]) => ({
      source_name,
      total_amount: data.total_amount,
      payment_count: data.payment_count,
    }));
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from("payments")
          .select("*");

        if (paymentsError) throw paymentsError;

        // Fetch athletes
        const { data: athletesData, error: athletesError } = await supabase
          .from("athletes")
          .select("*");

        if (athletesError) throw athletesError;

        // Fetch sports
        const { data: sportsData, error: sportsError } = await supabase
          .from("sports")
          .select("*");

        if (sportsError) throw sportsError;

        // Fetch spending limits
        const { data: limitsData, error: limitsError } = await supabase
          .from("spending_limits")
          .select(`
            *,
            sports (name)
          `);

        if (limitsError) throw limitsError;

        // Format spending limits data
        const formattedLimits = limitsData?.map((limit) => ({
          ...limit,
          sport_name: limit.sports?.name || "Unknown Sport",
        })) || [];

        setPayments(paymentsData || []);
        setAthletes(athletesData || []);
        setSports(sportsData || []);
        setSpendingLimits(formattedLimits);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and analyze your NIL payment data with powerful charts and
            metrics
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
              />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            color={metric.color}
          />
        ))}
      </div>

      {/* Filters */}
      <AnalyticsFilter
        timePeriod={timePeriod}
        setTimePeriod={setTimePeriod}
        sports={sports}
        selectedSport={selectedSport}
        setSelectedSport={setSelectedSport}
      />

      {/* Charts */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              NIL Payment Trends
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Accumulated NIL payments over time
            </p>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
                </div>
              ) : getFilteredPayments().length > 0 ? (
                <AccumulatedPaymentsChart payments={getFilteredPayments()} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No payment data available</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Spending Limits Usage
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Current spending compared to defined limits by sport
            </p>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
                </div>
              ) : spendingLimits.length > 0 && getFilteredPaymentsBySport(getFilteredPayments()).length > 0 ? (
                <SpendingLimitsChart
                  spendingLimits={spendingLimits}
                  sportPaymentData={getFilteredPaymentsBySport(getFilteredPayments())}
                  period={timePeriod}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No spending limits data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Payment Distribution by Sport
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Breakdown of NIL payments across different sports
            </p>
            <div className="h-64">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
                </div>
              ) : getFilteredPaymentsBySport(payments).length > 0 ? (
                <SportDistributionPieChart
                  sportData={getFilteredPaymentsBySport(payments)}
                  filteredPayments={payments}
                />
              ) : (
                <div className="text-center text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Gender Comparison
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              NIL payment comparison between male and female athletes
            </p>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
                </div>
              ) : getFilteredPaymentsByGender().length > 0 ? (
                <GenderDistributionPieChart
                  genderData={getFilteredPaymentsByGender()}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No gender data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Top Earners
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Athletes with highest NIL payments
            </p>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
                </div>
              ) : getTopEarners().length > 0 ? (
                <TopEarnersChart topEarners={getTopEarners()} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No payment data available</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Payment Sources
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Types of NIL payment sources
            </p>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
                </div>
              ) : getPaymentSources().length > 0 ? (
                <PaymentSourcesChart paymentSources={getPaymentSources()} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No payment data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
