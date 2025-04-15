import { useState, useEffect } from "react";
import { createClientComponentClient } from "@/lib/auth";

interface PaymentEditModalProps {
  payment: {
    id: string;
    athlete_id: string;
    amount: number;
    date: string;
    source: string;
    activity_type: string;
  };
  athletes: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSave: () => void;
}

export default function PaymentEditModal({
  payment,
  athletes,
  onClose,
  onSave,
}: PaymentEditModalProps) {
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState({
    athlete_id: payment.athlete_id || "",
    amount: payment.amount || 0,
    date: payment.date || new Date().toISOString().split("T")[0],
    source: payment.source || "",
    activity_type: payment.activity_type || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common payment sources
  const commonSources = [
    "Social Media",
    "Appearance",
    "Autograph",
    "Merchandise",
    "Camp/Clinic",
    "Other",
  ];

  const activityTypes = [
    "Instagram Post",
    "Twitter Post",
    "TikTok Video",
    "YouTube Video",
    "Personal Appearance",
    "Autograph Signing",
    "Merchandise Sale",
    "Camp/Clinic Instruction",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get current user to retrieve organization_id
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // First try to get organization_id from user metadata
      let organizationId = user.user_metadata?.organization_id;
      
      // If not in metadata, try to fetch from organizations table
      if (!organizationId) {
        const { data: orgData } = await supabase
          .from('organizations')
          .select('id')
          .eq('admin_user_id', user.id)
          .single();
        
        if (orgData) {
          organizationId = orgData.id;
        }
      }
      
      // If still no organization, try to get from an existing athlete
      if (!organizationId) {
        const { data: athleteData } = await supabase
          .from('athletes')
          .select('organization_id')
          .eq('id', formData.athlete_id)
          .single();
        
        if (athleteData?.organization_id) {
          organizationId = athleteData.organization_id;
        }
      }
      
      // Final fallback - get from any athlete
      if (!organizationId) {
        const { data: anyAthleteData } = await supabase
          .from('athletes')
          .select('organization_id')
          .limit(1)
          .single();
        
        if (anyAthleteData?.organization_id) {
          organizationId = anyAthleteData.organization_id;
        }
      }
      
      if (!organizationId) {
        throw new Error("Could not determine organization. Please contact administrator.");
      }
      
      const paymentData = {
        athlete_id: formData.athlete_id,
        amount: Number(formData.amount),
        date: formData.date,
        source: formData.source,
        activity_type: formData.activity_type,
        organization_id: organizationId // Add organization_id to payment data
      };

      console.log('Saving payment with data:', paymentData);
      
      let result;
      if (payment.id) {
        // Update existing payment
        result = await supabase
          .from("payments")
          .update(paymentData)
          .eq("id", payment.id);
      } else {
        // Create new payment
        result = await supabase.from("payments").insert(paymentData);
      }

      if (result.error) {
        console.error("Supabase error:", result.error);
        throw new Error(result.error.message || "Failed to save payment");
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error saving payment:", error);
      setError(
        error?.message ||
          error?.error?.message ||
          "Failed to save payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {payment.id ? "Edit Payment" : "Add New Payment"}
        </h2>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Athlete
            </label>
            <select
              value={formData.athlete_id}
              onChange={(e) =>
                setFormData({ ...formData, athlete_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ncaa-blue"
              required
            >
              <option value="">Select an athlete</option>
              {athletes.map((athlete) => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: e.target.value ? parseFloat(e.target.value) : 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ncaa-blue"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ncaa-blue"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ncaa-blue"
              required
            >
              <option value="">Select a source</option>
              {commonSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Type
            </label>
            <select
              value={formData.activity_type}
              onChange={(e) =>
                setFormData({ ...formData, activity_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ncaa-blue"
              required
            >
              <option value="">Select an activity type</option>
              {activityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-ncaa-blue rounded-md hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-ncaa-blue disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : payment.id
                ? "Save Changes"
                : "Add Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
