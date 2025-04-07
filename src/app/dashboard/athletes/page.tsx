"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Athlete,
  Sport,
  fetchAthletesWithSport,
  deleteAthleteWithPayments,
} from "@/lib/supabase";
import AddAthleteModal from "@/components/athletes/AddAthleteModal";
import DeleteAthleteConfirmationModal from "@/components/athletes/DeleteAthleteConfirmationModal";
import { getSupabase } from "@/lib/supabase";

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<(Athlete & { sport: Sport })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [athleteToDelete, setAthleteToDelete] = useState<Athlete | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAthletesWithSport();
        setAthletes(data);
      } catch (err) {
        setError("Failed to load athletes data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get unique sports from athlete data
  const uniqueSports = React.useMemo(() => {
    const sportSet = new Set(
      athletes.map((athlete) => athlete.sport?.name || "Unknown")
    );
    return Array.from(sportSet).sort();
  }, [athletes]);

  // Filter and sort athletes
  const filteredAthletes = React.useMemo(() => {
    return athletes
      .filter((athlete) => {
        // Search term filter
        const matchesSearch =
          athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          athlete.sport?.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Gender filter
        const matchesGender =
          genderFilter === "all" ||
          athlete.gender.toLowerCase() === genderFilter.toLowerCase();

        // Sport filter
        const matchesSport =
          sportFilter === "all" || athlete.sport?.name === sportFilter;

        return matchesSearch && matchesGender && matchesSport;
      })
      .sort((a, b) => {
        let valueA, valueB;

        // Determine which field to sort by
        switch (sortField) {
          case "name":
            valueA = a.name;
            valueB = b.name;
            break;
          case "gender":
            valueA = a.gender;
            valueB = b.gender;
            break;
          case "sport":
            valueA = a.sport?.name || "";
            valueB = b.sport?.name || "";
            break;
          default:
            valueA = a.name;
            valueB = b.name;
        }

        // Compare the values
        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    athletes,
    searchTerm,
    genderFilter,
    sportFilter,
    sortField,
    sortDirection,
  ]);

  // Handle sort toggle
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;

    return <span className="ml-1">{sortDirection === "asc" ? "▲" : "▼"}</span>;
  };

  const handleAthleteAdded = (newAthlete: Athlete) => {
    // Fetch the updated list of athletes to ensure we have all the data including relations
    fetchAthletesWithSport()
      .then((data) => {
        setAthletes(data);
      })
      .catch((err) => {
        console.error("Error refreshing athletes after addition:", err);
      });
  };

  const handleDeleteClick = (athlete: Athlete) => {
    setAthleteToDelete(athlete);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!athleteToDelete) return;

    setIsDeleting(true);
    try {
      console.log(
        `Attempting to delete athlete: ${JSON.stringify(athleteToDelete)}`
      );

      // Use the utility function instead of manual deletion logic
      await deleteAthleteWithPayments(athleteToDelete.id);

      console.log("Athlete and associated payments deleted successfully");

      // Refresh the athletes list
      const refreshedAthletes = await fetchAthletesWithSport();
      setAthletes(refreshedAthletes);

      // Close the delete modal
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting athlete:", error);
      setError("Failed to delete athlete. Please try again later.");
    } finally {
      setIsDeleting(false);
      setAthleteToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setAthleteToDelete(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Athletes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all athletes in your program
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
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
            Add Athlete
          </button>
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
                placeholder="Search by name or sport..."
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

          {/* Gender Filter */}
          <div>
            <label
              htmlFor="gender-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <select
              id="gender-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm rounded-md"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
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

      {/* Athletes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    {renderSortIndicator("name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort("gender")}
                >
                  <div className="flex items-center">
                    Gender
                    {renderSortIndicator("gender")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort("sport")}
                >
                  <div className="flex items-center">
                    Sport
                    {renderSortIndicator("sport")}
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
              {filteredAthletes.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No athletes found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredAthletes.map((athlete) => (
                  <tr key={athlete.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {athlete.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {athlete.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {athlete.id.toString().substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          athlete.gender.toLowerCase() === "male"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {athlete.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {athlete.sport?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/athletes/${athlete.id}`}
                          className="text-ncaa-blue hover:text-ncaa-darkblue"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/athletes/${athlete.id}`}
                          className="text-ncaa-blue hover:text-ncaa-darkblue"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(athlete)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
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
              <span className="font-medium">{filteredAthletes.length}</span> of{" "}
              <span className="font-medium">{athletes.length}</span> athletes
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

      {/* Add Athlete Modal */}
      <AddAthleteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAthleteAdded={handleAthleteAdded}
      />

      {/* Delete Athlete Confirmation Modal */}
      <DeleteAthleteConfirmationModal
        isOpen={isDeleteModalOpen}
        athlete={athleteToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
