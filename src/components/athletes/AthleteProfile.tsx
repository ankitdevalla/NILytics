"use client";

import { createClientComponentClient } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, useMemo } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Sport {
  id: string;
  name: string;
}

interface Athlete {
  id: string;
  name: string;
  year: string;
  avatar_url: string | null;
  gender: string;
  sport: Sport;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  source: string;
  activity_type: string;
}

interface AthleteProfileProps {
  athleteId: string;
}

export default function AthleteProfile({ athleteId }: AthleteProfileProps) {
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");
  const supabase = createClientComponentClient();

  const uniqueActivityTypes = useMemo(() => {
    if (!payments.length) return [];
    const activitySet = new Set(
      payments.map((payment) => payment.activity_type)
    );
    return Array.from(activitySet).sort();
  }, [payments]);

  const last30DaysPayments = useMemo(() => {
    return payments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return paymentDate >= thirtyDaysAgo;
    });
  }, [payments]);

  const academicYearPayments = useMemo(() => {
    return payments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      const academicYearStart = new Date("2024-08-01"); // August 1st, 2024
      const academicYearEnd = new Date("2025-07-31"); // July 31st, 2025
      return paymentDate >= academicYearStart && paymentDate <= academicYearEnd;
    });
  }, [payments]);

  useEffect(() => {
    const fetchAthleteData = async () => {
      const { data: athleteData, error: athleteError } = await supabase
        .from("athletes")
        .select(
          `
          *,
          sport:sport_id (
            id,
            name
          )
        `
        )
        .eq("id", athleteId)
        .single();

      if (athleteError) {
        console.error("Error fetching athlete:", athleteError);
        return;
      }

      setAthlete(athleteData);

      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .select(
          `
          id,
          date,
          amount,
          source,
          activity_type,
          athlete_id
        `
        )
        .eq("athlete_id", athleteId)
        .order("date", { ascending: false });

      if (paymentError) {
        console.error("Error fetching payments:", paymentError);
        return;
      }

      setPayments(paymentData);
    };

    fetchAthleteData();
  }, [athleteId]);

  if (!athlete) return <div>Loading...</div>;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const calculateTotal = (payments: Payment[]) => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  // Handle sort toggle
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === "asc" ? "▲" : "▼"}</span>;
  };

  // Filter and sort payments based on time period and filters
  const getFilteredPayments = (periodPayments: Payment[]) => {
    return periodPayments
      .filter((payment) => {
        return (
          activityTypeFilter === "all" ||
          payment.activity_type === activityTypeFilter
        );
      })
      .sort((a, b) => {
        let valueA, valueB;

        switch (sortField) {
          case "date":
            valueA = new Date(a.date).getTime();
            valueB = new Date(b.date).getTime();
            break;
          case "amount":
            valueA = a.amount;
            valueB = b.amount;
            break;
          case "activity":
            valueA = a.activity_type;
            valueB = b.activity_type;
            break;
          case "source":
            valueA = a.source;
            valueB = b.source;
            break;
          default:
            valueA = new Date(a.date).getTime();
            valueB = new Date(b.date).getTime();
        }

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  };

  const PaymentTable = ({ payments }: { payments: Payment[] }) => {
    const filteredPayments = getFilteredPayments(payments);

    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Activity Type Filter */}
            <div>
              <label
                htmlFor="activity-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Activity Type
              </label>
              <select
                id="activity-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm rounded-md shadow-sm"
                value={activityTypeFilter}
                onChange={(e) => setActivityTypeFilter(e.target.value)}
              >
                <option value="all">All Activities</option>
                {uniqueActivityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Summary Cards */}
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-2xl font-semibold mt-1">
                  {filteredPayments.length}
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-semibold mt-1">
                  {formatCurrency(calculateTotal(filteredPayments))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Activity Type
                </th>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.activity_type}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard/athletes">
            <Button variant="ghost" className="gap-2 hover:bg-white/50">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete Athlete
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-ncaa-blue to-ncaa-darkblue">
          <CardContent className="relative pt-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white bg-white">
                <AvatarImage src={athlete.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-ncaa-blue/10">
                  {getInitials(athlete.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white mb-6">
                    {athlete.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        athlete.gender.toLowerCase() === "male"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {athlete.gender}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-white text-ncaa-blue text-sm font-medium">
                      {athlete.sport.name}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-white text-gray-700 text-sm font-medium">
                      {athlete.year}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History Section */}
        <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Payment History
              </h2>
              <p className="text-muted-foreground">
                View and manage athlete payments
              </p>
            </div>
            <Button className="gap-2 bg-ncaa-blue hover:bg-ncaa-darkblue">
              Add New Payment
            </Button>
          </div>

          <Tabs defaultValue="30days" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="30days">30 Days</TabsTrigger>
              <TabsTrigger value="year">2024-2025</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
            </TabsList>

            <TabsContent value="30days" className="space-y-6 mt-6">
              <PaymentTable payments={last30DaysPayments} />
            </TabsContent>

            <TabsContent value="year" className="space-y-6 mt-6">
              <PaymentTable payments={academicYearPayments} />
            </TabsContent>

            <TabsContent value="allTime" className="space-y-6 mt-6">
              <PaymentTable payments={payments} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
