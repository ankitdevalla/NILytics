"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface SpendingLimit {
  id: string;
  sport_id: string;
  sport_name: string;
  limit_amount: number;
  period: "monthly" | "quarterly" | "yearly";
  created_at: string;
  updated_at: string;
}

export default function SpendingLimitsPage() {
  const [limits, setLimits] = useState<SpendingLimit[]>([]);
  const [sports, setSports] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLimit, setNewLimit] = useState({
    sport_id: "",
    limit_amount: "",
    period: "monthly",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      // Fetch sports
      const { data: sportsData, error: sportsError } = await supabase
        .from("sports")
        .select("id, name")
        .order("name");

      if (sportsError) {
        console.error("Error fetching sports:", sportsError.message);
        throw new Error(`Failed to load sports: ${sportsError.message}`);
      }
      setSports(sportsData || []);

      // Fetch spending limits
      const { data: limitsData, error: limitsError } = await supabase.from(
        "spending_limits"
      ).select(`
          *,
          sports (
            name
          )
        `);

      if (limitsError) {
        console.error("Error fetching spending limits:", limitsError.message);
        throw new Error(
          `Failed to load spending limits: ${limitsError.message}`
        );
      }

      const formattedLimits =
        limitsData?.map((limit) => ({
          ...limit,
          sport_name: limit.sports?.name || "Unknown Sport",
        })) || [];

      setLimits(formattedLimits);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error in fetchData:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLimit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLimit.sport_id || !newLimit.limit_amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("spending_limits").insert({
        sport_id: newLimit.sport_id,
        limit_amount: parseFloat(newLimit.limit_amount),
        period: newLimit.period,
      });

      if (error) {
        console.error("Supabase error creating spending limit:", error.message);
        throw new Error(`Failed to create spending limit: ${error.message}`);
      }

      toast.success("Spending limit created successfully");
      setNewLimit({
        sport_id: "",
        limit_amount: "",
        period: "monthly",
      });
      fetchData();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error in handleCreateLimit:", error);
      toast.error(errorMessage);
    }
  };

  const handleDeleteLimit = async (id: string) => {
    if (!confirm("Are you sure you want to delete this spending limit?"))
      return;

    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("spending_limits")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Spending limit deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting spending limit:", error);
      toast.error("Failed to delete spending limit");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Spending Limits</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Spending Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateLimit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sport">Sport</Label>
                  <Select
                    value={newLimit.sport_id}
                    onValueChange={(value) =>
                      setNewLimit({ ...newLimit, sport_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          {sport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Limit Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newLimit.limit_amount}
                    onChange={(e) =>
                      setNewLimit({ ...newLimit, limit_amount: e.target.value })
                    }
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label htmlFor="period">Period</Label>
                  <Select
                    value={newLimit.period}
                    onValueChange={(value) =>
                      setNewLimit({
                        ...newLimit,
                        period: value as "monthly" | "quarterly" | "yearly",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit">Create Limit</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Spending Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sport
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Limit Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {limits.map((limit) => (
                    <tr key={limit.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {limit.sport_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${limit.limit_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">
                        {limit.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLimit(limit.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
