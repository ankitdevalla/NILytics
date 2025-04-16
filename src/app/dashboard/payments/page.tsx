"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Athlete,
  Payment,
  Sport,
  fetchAthletesWithSport,
  fetchPaymentsWithDetails,
  deletePayment
} from '@/lib/supabase';
import AddPaymentModal from "@/components/payments/AddPaymentModal";
import PaymentEditModal from "@/components/payments/PaymentEditModal";
import { createClientComponentClient } from '@/lib/auth';

type PaymentWithDetails = Payment & { athlete: Athlete & { sport: Sport } };

export default function PaymentsPage() {
  const supabase = createClientComponentClient();
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] =
    useState<PaymentWithDetails | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Get the current user's organization_id
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Get organization_id from user metadata or organizations table
        let organizationId = user.user_metadata?.organization_id;
        
        if (!organizationId) {
          // Try to get from organizations table
          const { data: orgData } = await supabase
            .from('organizations')
            .select('id')
            .eq('admin_user_id', user.id)
            .single();
          
          if (orgData) {
            organizationId = orgData.id;
          }
        }
        
        if (!organizationId) {
          throw new Error("User does not belong to an organization");
        }
        
        console.log('Fetching payments and athletes for organization:', organizationId);
        
        const [paymentsData, athletesData] = await Promise.all([
          fetchPaymentsWithDetails(), // This already filters by organization_id
          supabase.from("athletes").select("*").eq("organization_id", organizationId),
        ]);

        setPayments(paymentsData as PaymentWithDetails[]);
        setAthletes(athletesData.data || []);
      } catch (err) {
        setError("Failed to load payments. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get unique activity types from payment data
  const uniqueActivityTypes = React.useMemo(() => {
    const activitySet = new Set(
      payments.map((payment) => payment.activity_type)
    );
    return Array.from(activitySet).sort();
  }, [payments]);

  // Get unique sports from payment data
  const uniqueSports = React.useMemo(() => {
    const sportSet = new Set(
      payments.map((payment) => payment.athlete?.sport?.name || "Unknown")
    );
    return Array.from(sportSet).sort();
  }, [payments]);

  // Filter and sort payments
  const filteredPayments = React.useMemo(() => {
    return payments
      .filter((payment) => {
        // Search term filter
        const matchesSearch =
          payment.athlete?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.activity_type
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        // Activity type filter
        const matchesActivityType =
          activityTypeFilter === "all" ||
          payment.activity_type === activityTypeFilter;

        // Sport filter
        const matchesSport =
          sportFilter === "all" || payment.athlete?.sport?.name === sportFilter;

        return matchesSearch && matchesActivityType && matchesSport;
      })
      .sort((a, b) => {
        let valueA, valueB;

        // Determine which field to sort by
        switch (sortField) {
          case "date":
            valueA = new Date(a.date).getTime();
            valueB = new Date(b.date).getTime();
            break;
          case "amount":
            valueA = a.amount;
            valueB = b.amount;
            break;
          case "athlete":
            valueA = a.athlete?.name || "";
            valueB = b.athlete?.name || "";
            break;
          case "activity":
            valueA = a.activity_type;
            valueB = b.activity_type;
            break;
          default:
            valueA = new Date(a.date).getTime();
            valueB = new Date(b.date).getTime();
        }

        // Compare the values
        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    payments,
    searchTerm,
    activityTypeFilter,
    sportFilter,
    sortField,
    sortDirection,
  ]);

  // Calculate total payments amount
  const totalAmount = React.useMemo(() => {
    return filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [filteredPayments]);

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

  const handlePaymentAdded = (newPayment: Payment) => {
    // Fetch the updated list of payments to ensure we have all the data including relations
    fetchPaymentsWithDetails()
      .then((data) => {
        setPayments(data as PaymentWithDetails[]);
      })
      .catch((err) => {
        console.error("Error refreshing payments after addition:", err);
      });
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment as PaymentWithDetails);
    setShowEditModal(true);
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    try {
      // Use the deletePayment function from supabase.ts which handles organization filtering
      await deletePayment(paymentId);
      
      // Remove the deleted payment from the local state
      setPayments((currentPayments) =>
        currentPayments.filter((payment) => payment.id.toString() !== paymentId)
      );
      
      console.log(`Payment ${paymentId} successfully deleted`);
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert(error instanceof Error ? error.message : "Failed to delete payment. Please try again.");
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">NIL Payments</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all NIL payments to athletes
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              setEditingPayment(null);
              setShowEditModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Payment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Payments</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {filteredPayments.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Average Payment</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatCurrency(
              filteredPayments.length
                ? totalAmount / filteredPayments.length
                : 0
            )}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500">Unique Athletes</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {new Set(filteredPayments.map((p) => p.athlete_id)).size}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                placeholder="Search by athlete, source, or activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Activity Type Filter */}
          <div>
            <label
              htmlFor="activity-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Activity Type
            </label>
            <select
              id="activity-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm rounded-md"
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

          {/* Sport Filter */}
          <div>
            <label
              htmlFor="sport-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sport
            </label>
            <select
              id="sport-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm rounded-md"
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
            >
              <option value="all">All Sports</option>
              {uniqueSports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {renderSortIndicator("date")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort("athlete")}
                >
                  <div className="flex items-center">
                    Athlete
                    {renderSortIndicator("athlete")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort("activity")}
                >
                  <div className="flex items-center">
                    Activity
                    {renderSortIndicator("activity")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Source
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Proof Link
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort("amount")}
                >
                  <div className="flex items-center justify-end">
                    Amount
                    {renderSortIndicator("amount")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No payments found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Link
                          href={`/athletes/${payment.athlete_id}`}
                          className="text-sm font-medium text-gray-900 hover:text-ncaa-blue"
                        >
                          {payment.athlete?.name || "Unknown"}
                        </Link>
                        <span
                          className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.athlete?.gender.toLowerCase() === "male"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-pink-100 text-pink-800"
                          }`}
                        >
                          {payment.athlete?.gender || "Unknown"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.athlete?.sport?.name || "Unknown Sport"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.activity_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.link ? (
                        <a
                          href={payment.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ncaa-blue hover:text-ncaa-darkblue hover:underline"
                        >
                          View Proof
                        </a>
                      ) : (
                        <span className="text-gray-400">No link provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-ncaa-blue hover:text-ncaa-darkblue mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id.toString())}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{filteredPayments.length}</span> of{" "}
              <span className="font-medium">{payments.length}</span> payments
            </div>
            <div className="flex-1 flex justify-end">
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Previous
              </button>
              <button
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPaymentAdded={handlePaymentAdded}
      />

      {showEditModal && (
        <PaymentEditModal
          payment={{
            id: editingPayment?.id?.toString() || "",
            athlete_id: editingPayment?.athlete_id?.toString() || "",
            amount: editingPayment?.amount || 0,
            date:
              editingPayment?.date || new Date().toISOString().split("T")[0],
            source: editingPayment?.source || "",
            activity_type: editingPayment?.activity_type || "", // Added missing property
          }}
          athletes={athletes.map((athlete) => ({
            id: athlete.id.toString(),
            name: athlete.name,
          }))}
          onClose={() => {
            setShowEditModal(false);
            setEditingPayment(null);
          }}
          onSave={() => {
            fetchPaymentsWithDetails()
              .then((data) => {
                setPayments(data as PaymentWithDetails[]);
              })
              .catch((err) => {
                console.error("Error refreshing payments:", err);
              });
          }}
        />
      )}
    </div>
  );
}
