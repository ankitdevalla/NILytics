"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@/lib/auth";

interface Athlete {
  id: string;
  name: string;
  gender: string;
  sport_id: string;
  year: string;
}

interface Sport {
  id: string;
  name: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditAthletePage({ params }: PageProps) {
  const { id: athleteId } = React.use(params);
  const router = useRouter();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Athlete>({
    id: "",
    name: "",
    gender: "Male",
    sport_id: "",
    year: "Freshman",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClientComponentClient();

      try {
        // Fetch athlete data
        const { data: athleteData, error: athleteError } = await supabase
          .from("athletes")
          .select("*")
          .eq("id", athleteId)
          .single();

        if (athleteError) throw athleteError;

        // Fetch sports data
        const { data: sportsData, error: sportsError } = await supabase
          .from("sports")
          .select("*");

        if (sportsError) throw sportsError;

        setAthlete(athleteData);
        setFormData(athleteData);
        setSports(sportsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load athlete data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [athleteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClientComponentClient();

    try {
      const { error } = await supabase
        .from("athletes")
        .update({
          name: formData.name,
          gender: formData.gender,
          sport_id: formData.sport_id,
          year: formData.year,
        })
        .eq("id", athleteId);

      if (error) throw error;

      router.push("/dashboard/athletes");
    } catch (err) {
      console.error("Error updating athlete:", err);
      setError("Failed to update athlete");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Athlete</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Athlete Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <select
                name="year"
                id="year"
                value={formData.year}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
              >
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>

            <div>
              <label htmlFor="sport_id" className="block text-sm font-medium text-gray-700">
                Sport *
              </label>
              <select
                name="sport_id"
                id="sport_id"
                value={formData.sport_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
                required
              >
                <option value="">Select sport</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard/athletes")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 