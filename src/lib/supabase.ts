import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "./auth";

// Define your Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Use the same Supabase client across the app
export const supabase = createClientComponentClient();

export const getSupabase = () => {
  return supabase;
};

// Helper function to get the current user's organization_id
export async function getCurrentUserOrganizationId(): Promise<string | null> {
  const supabase = getSupabase();
  
  console.log('getCurrentUserOrganizationId: Starting function');
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log('getCurrentUserOrganizationId: No user found');
    return null;
  }
  
  console.log('getCurrentUserOrganizationId: User found', { 
    id: user.id, 
    email: user.email,
    hasMetadata: !!user.user_metadata,
    metadataKeys: user.user_metadata ? Object.keys(user.user_metadata) : []
  });
  
  // Check if organization_id is in user metadata
  if (user.user_metadata?.organization_id) {
    console.log('getCurrentUserOrganizationId: Found organization_id in metadata:', user.user_metadata.organization_id);
    return user.user_metadata.organization_id;
  }
  
  console.log('getCurrentUserOrganizationId: No organization_id in metadata, checking organizations table');
  
  // If not in metadata, try to fetch from organizations table
  const { data, error } = await supabase
    .from('organizations')
    .select('id')
    .eq('admin_user_id', user.id)
    .single();
  
  if (error) {
    console.log('getCurrentUserOrganizationId: Error fetching from organizations table:', error);
    return null;
  }
  
  if (!data) {
    console.log('getCurrentUserOrganizationId: No organization found for user');
    return null;
  }
  
  console.log('getCurrentUserOrganizationId: Found organization_id in table:', data.id);
  return data.id;
}

export type Sport = {
  id: string;
  name: string;
  created_at: string;
  organization_id?: string;
};

export type Athlete = {
  id: number;
  name: string;
  gender: string;
  year: string;
  sport_id: string;
  created_at: string;
  organization_id?: string;
  sport?: Sport;
};

export type Payment = {
  id: number;
  athlete_id: string;
  amount: number;
  date: string;
  source: string;
  activity_type: string;
  created_at: string;
  organization_id: string; // Changed from optional to required
  link?: string; // URL to proof of NIL activity
  athlete?: Athlete & { sport?: Sport };
};

export async function fetchSports(): Promise<Sport[]> {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    console.warn("User does not belong to an organization, returning empty sports list");
    return [];
  }
  
  // Filter sports by organization_id
  const { data, error } = await supabase
    .from("sports")
    .select("*")
    .eq("organization_id", organizationId)
    .order("name");

  if (error) {
    console.error("Error fetching sports:", error);
    throw new Error("Failed to fetch sports");
  }

  return data || [];
}

export async function createSport(name: string): Promise<Sport> {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    throw new Error("User does not belong to an organization");
  }
  
  const { data, error } = await supabase
    .from("sports")
    .insert([{ name, organization_id: organizationId }])
    .select()
    .single();

  if (error) {
    console.error("Error creating sport:", error);
    throw new Error("Failed to create sport");
  }

  return data;
}

export async function updateSport(id: string, name: string): Promise<Sport> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("sports")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating sport:", error);
    throw new Error("Failed to update sport");
  }

  return data;
}

export async function deleteSport(id: string): Promise<void> {
  const supabase = getSupabase();
  console.log(`Attempting to delete sport with ID: ${id} and associated data using RPC`);

  try {
    // Use RPC to execute a SQL function that will handle the deletion in the correct order
    const { error } = await supabase.rpc('delete_sport_cascade_rpc', {
      p_sport_id: id,
    });

    if (error) {
      console.error(`Error in RPC delete_sport_cascade_rpc for ID ${id}:`, error);

      // Fallback to sequential delete if RPC doesn't exist or fails
      console.log('Fallback: Attempting sequential delete');

      // First, get all athletes for this sport
      const { data: athletes, error: fetchError } = await supabase
        .from('athletes')
        .select('id')
        .eq('sport_id', id);

      if (fetchError) {
        console.error(`Error fetching athletes for sport ID ${id}:`, fetchError);
        throw new Error(`Failed to fetch athletes: ${fetchError.message}`);
      }

      const athleteIds = athletes?.map(athlete => athlete.id) || [];
      console.log(`Found ${athleteIds.length} athletes for sport ID ${id}`);
      
      // For each athlete, delete their payments first
      for (const athleteId of athleteIds) {
        // Delete all payments for this athlete
        const { error: paymentsError } = await supabase
          .from('payments')
          .delete()
          .eq('athlete_id', athleteId.toString());

        if (paymentsError) {
          console.error(`Error deleting payments for athlete ID ${athleteId}:`, paymentsError);
        } else {
          console.log(`Successfully deleted payments for athlete ID ${athleteId}`);
        }
      }

      // Now delete all athletes for this sport
      const { error: athletesError } = await supabase
        .from('athletes')
        .delete()
        .eq('sport_id', id);

      if (athletesError) {
        console.error(`Error deleting athletes for sport ID ${id}:`, athletesError);
      } else {
        console.log(`Successfully deleted all athletes for sport ID ${id}`);
      }

      // Finally delete the sport itself
      const { error: sportError } = await supabase
        .from('sports')
        .delete()
        .eq('id', id);

      if (sportError) {
        console.error(`Error deleting sport ID ${id}:`, sportError);
        throw new Error(`Failed to delete sport: ${sportError.message}`);
      }
    } else {
      console.log(`Successfully deleted sport with ID ${id} via RPC`);
    }
  } catch (error) {
    console.error(`Error in deleteSport for ID ${id}:`, error);
    throw error;
  }
}

export async function fetchAthletes(): Promise<Athlete[]> {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    console.warn("User does not belong to an organization, returning empty athletes list");
    return [];
  }
  
  // Filter athletes by organization_id
  const { data, error } = await supabase
    .from("athletes")
    .select("*")
    .eq("organization_id", organizationId)
    .order("name");

  if (error) {
    console.error("Error fetching athletes:", error);
    throw new Error("Failed to fetch athletes");
  }

  return data || [];
}

export async function fetchAthletesWithSport(): Promise<
  (Athlete & { sport: Sport })[]
> {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    console.warn("User does not belong to an organization, returning empty athletes list");
    return [];
  }
  
  const { data, error } = await supabase
    .from("athletes")
    .select(
      `
      *,
      sport:sports(*)
    `
    )
    .eq("organization_id", organizationId)
    .order("name");

  if (error) {
    console.error("Error fetching athletes with sport:", error);
    throw new Error("Failed to fetch athletes with sport");
  }

  return data || [];
}

export async function fetchPayments(): Promise<Payment[]> {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    console.warn("User does not belong to an organization, returning empty payments list");
    return [];
  }
  
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("organization_id", organizationId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    throw new Error("Failed to fetch payments");
  }

  return data || [];
}

export async function fetchPaymentsWithDetails(): Promise<Payment[]> {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    console.warn("User does not belong to an organization, returning empty payments list");
    return [];
  }
  
  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      athlete:athletes(
        *,
        sport:sports(*)
      )
    `
    )
    .eq("organization_id", organizationId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching payments with details:", error);
    throw new Error("Failed to fetch payments with details");
  }

  return data || [];
}

export async function fetchAthleteById(
  id: number
): Promise<Athlete & { sport: Sport }> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("athletes")
    .select(
      `
      *,
      sport:sports(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching athlete with ID ${id}:`, error);
    throw new Error(`Failed to fetch athlete with ID ${id}`);
  }

  return data;
}

export async function fetchPaymentById(
  id: number
): Promise<Payment & { athlete: Athlete & { sport: Sport } }> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      athlete:athletes(
        *,
        sport:sports(*)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching payment with ID ${id}:`, error);
    throw new Error(`Failed to fetch payment with ID ${id}`);
  }

  return data;
}

export async function fetchPaymentsByAthleteId(
  athleteId: number
): Promise<Payment[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("athlete_id", athleteId)
    .order("date", { ascending: false });

  if (error) {
    console.error(
      `Error fetching payments for athlete ID ${athleteId}:`,
      error
    );
    throw new Error(`Failed to fetch payments for athlete ID ${athleteId}`);
  }

  return data || [];
}

export async function createAthlete(
  athlete: Omit<Athlete, "id" | "created_at" | "organization_id">
): Promise<Athlete> {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    throw new Error("User does not belong to an organization");
  }
  
  // Add organization_id to the athlete data
  const athleteWithOrg = {
    ...athlete,
    organization_id: organizationId
  };
  
  const { data, error } = await supabase
    .from("athletes")
    .insert([athleteWithOrg])
    .select()
    .single();

  if (error) {
    console.error("Error creating athlete:", error);
    throw new Error("Failed to create athlete");
  }

  return data;
}

export async function createPayment(
  payment: Omit<Payment, "id" | "created_at" | "organization_id">
): Promise<Payment> {
  const supabase = getSupabase();
  
  console.log('Starting createPayment function');
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  console.log('Current user:', { id: user.id, email: user.email });
  
  // First try to get organization_id from user metadata
  let organizationId = user.user_metadata?.organization_id;
  console.log('Organization ID from metadata:', organizationId);
  
  // If not in metadata, try to fetch from organizations table
  if (!organizationId) {
    console.log('Trying to get organization from organizations table');
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('admin_user_id', user.id)
      .single();
    
    if (orgError) {
      console.error('Error fetching organization:', orgError);
    } else if (orgData) {
      organizationId = orgData.id;
      console.log('Found organization in table:', organizationId);
    }
  }
  
  // If still no organization, try to get the first athlete's organization
  if (!organizationId) {
    console.log('Trying to get organization from athlete');
    const { data: athleteData, error: athleteError } = await supabase
      .from('athletes')
      .select('organization_id')
      .limit(1)
      .single();
    
    if (athleteError) {
      console.error('Error fetching athlete organization:', athleteError);
    } else if (athleteData?.organization_id) {
      organizationId = athleteData.organization_id;
      console.log('Using organization from athlete:', organizationId);
    }
  }
  
  // If still no organization, try to get the first sport's organization
  if (!organizationId) {
    console.log('Trying to get organization from sport');
    const { data: sportData, error: sportError } = await supabase
      .from('sports')
      .select('organization_id')
      .limit(1)
      .single();
    
    if (sportError) {
      console.error('Error fetching sport organization:', sportError);
    } else if (sportData?.organization_id) {
      organizationId = sportData.organization_id;
      console.log('Using organization from sport:', organizationId);
    }
  }
  
  // Final check - if still no organization, we can't proceed
  if (!organizationId) {
    console.error('No organization ID found after all attempts');
    throw new Error("Could not determine organization. Please contact administrator.");
  }
  
  // Add organization_id to the payment data
  const paymentWithOrg = {
    ...payment,
    organization_id: organizationId
  };
  
  console.log('Attempting to insert payment with data:', paymentWithOrg);
  
  const { data, error } = await supabase
    .from("payments")
    .insert([paymentWithOrg])
    .select()
    .single();

  if (error) {
    console.error("Error creating payment:", error);
    throw new Error(`Failed to create payment: ${error.message}`);
  }

  console.log('Payment created successfully, returned data:', data);
  return data;
}

export async function updateAthlete(
  id: number,
  updates: Partial<Omit<Athlete, "id" | "created_at">>
): Promise<Athlete> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("athletes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating athlete ID ${id}:`, error);
    throw new Error(`Failed to update athlete ID ${id}`);
  }

  return data;
}

export async function updatePayment(
  id: number,
  updates: Partial<Omit<Payment, "id" | "created_at">>
): Promise<Payment> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("payments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating payment ID ${id}:`, error);
    throw new Error(`Failed to update payment ID ${id}`);
  }

  return data;
}

export async function deleteAthlete(id: number): Promise<void> {
  const supabase = getSupabase();
  console.log(`Attempting to delete athlete with ID: ${id} (${typeof id})`);

  const { error } = await supabase.from("athletes").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting athlete ID ${id}:`, error);
    throw new Error(`Failed to delete athlete ID ${id}: ${error.message}`);
  }

  console.log(`Successfully deleted athlete with ID ${id}`);
}

export async function deleteAthleteWithPayments(id: number): Promise<void> {
  const supabase = getSupabase();
  console.log(
    `Attempting to delete athlete with ID: ${id} and associated payments using direct SQL`
  );

  try {
    // Use RPC to execute a SQL command that will handle the deletion in the correct order
    const { error } = await supabase.rpc("delete_athlete_with_payments", {
      p_athlete_id: id,
    });

    if (error) {
      console.error(
        `Error in RPC delete_athlete_with_payments for ID ${id}:`,
        error
      );

      // Fallback to sequential delete if RPC doesn't exist
      console.log("Fallback: Attempting sequential delete");

      // First delete all payments (convert ID to string)
      const { error: paymentsError } = await supabase
        .from("payments")
        .delete()
        .eq("athlete_id", id.toString());

      if (paymentsError) {
        console.error(
          `Error deleting payments for athlete ID ${id}:`,
          paymentsError
        );
        throw new Error(
          `Failed to delete payments for athlete ID ${id}: ${paymentsError.message}`
        );
      }

      console.log(`Successfully deleted payments for athlete ID ${id}`);

      // Then try to delete the athlete
      const { error: athleteError } = await supabase
        .from("athletes")
        .delete()
        .eq("id", id);

      if (athleteError) {
        console.error(`Error deleting athlete ID ${id}:`, athleteError);
        throw new Error(
          `Failed to delete athlete ID ${id}: ${athleteError.message}`
        );
      }
    } else {
      console.log(
        `Successfully deleted athlete with ID ${id} and all payments via RPC`
      );
    }
  } catch (err) {
    console.error(
      `Unexpected error in deleteAthleteWithPayments for ID ${id}:`,
      err
    );
    throw err;
  }
}

export async function deletePayment(id: number | string): Promise<void> {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    console.error('User does not belong to an organization');
    throw new Error('User does not belong to an organization');
  }
  
  console.log(`Attempting to delete payment ID ${id} for organization ${organizationId} using RPC`);
  
  // Convert id to string if it's a number to ensure consistent comparison
  const paymentId = typeof id === 'number' ? id.toString() : id;
  
  try {
    // Use RPC to execute the PostgreSQL function that handles payment deletion with organization security
    const { error } = await supabase.rpc('delete_payment_by_id', {
      p_payment_id: paymentId,
      p_organization_id: organizationId
    });

    if (error) {
      console.error(`Error in RPC delete_payment_by_id for ID ${paymentId}:`, error);
      throw new Error(`Failed to delete payment: ${error.message}`);
    }
    
    console.log(`Successfully deleted payment ID ${paymentId} via RPC`);
  } catch (error) {
    console.error(`Error deleting payment ID ${paymentId}:`, error);
    throw error instanceof Error ? error : new Error('Unknown error deleting payment');
  }
}

export async function fetchDashboardStats() {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    console.error('User does not belong to an organization');
    throw new Error('User does not belong to an organization');
  }
  
  console.log('Fetching dashboard stats for organization:', organizationId);
  
  // Get payment distribution by gender (for gender stats)
  const { data: genderDistribution, error: genderError } = await supabase.rpc(
    "get_payment_distribution_by_gender",
    { organization_filter: organizationId }
  );

  if (genderError) {
    console.error(
      "Error fetching payment distribution by gender:",
      genderError
    );
    throw new Error("Failed to fetch payment distribution by gender");
  }

  // Get athlete count by gender
  const { data: athleteCountByGender, error: athleteError } = await supabase
    .from("athletes")
    .select("gender")
    .eq("organization_id", organizationId) // Filter by organization_id
    .then((result) => {
      if (result.error) throw result.error;

      // Group the athletes by gender and count them
      const genderCounts: { gender: string; count: number }[] = [];
      const genderMap: Record<string, number> = {};

      result.data?.forEach((athlete) => {
        const gender = athlete.gender;
        if (!genderMap[gender]) {
          genderMap[gender] = 0;
        }
        genderMap[gender]++;
      });

      // Convert the map to array format
      Object.keys(genderMap).forEach((gender) => {
        genderCounts.push({ gender, count: genderMap[gender] });
      });

      return { data: genderCounts, error: null };
    });

  if (athleteError) {
    console.error("Error fetching athlete gender stats:", athleteError);
    throw new Error("Failed to fetch athlete gender statistics");
  }

  // Get payment distribution by month using get_payment_trends
  let paymentsByMonth = [];
  try {
    const { data: monthlyData, error: monthlyError } = await supabase.rpc(
      "get_payment_trends",
      {
        interval_type: "month",
        organization_filter: organizationId // Add organization filter
      }
    );

    if (monthlyError) {
      console.error(
        "Error fetching monthly payment data:",
        JSON.stringify(monthlyError, null, 2)
      );
      console.error("Error details:", {
        message: monthlyError.message,
        code: monthlyError.code,
        details: monthlyError.details,
        hint: monthlyError.hint,
      });
      // Don't throw, use fallback implementation instead
    } else {
      paymentsByMonth = monthlyData;
    }
  } catch (error) {
    console.error("Exception in get_payment_trends:", error);
    // Continue with fallback implementation
  }

  // Fallback implementation if RPC call fails
  if (!paymentsByMonth || paymentsByMonth.length === 0) {
    console.log("Using fallback implementation for payment trends");
    // Fetch raw payment data and aggregate by month
    const { data: rawPayments, error: rawPaymentsError } = await supabase
      .from("payments")
      .select("*")
      .eq("organization_id", organizationId); // Filter by organization_id

    if (rawPaymentsError) {
      console.error(
        "Error fetching raw payments for fallback:",
        rawPaymentsError
      );
      throw new Error(
        `Failed to fetch payment data: ${rawPaymentsError.message}`
      );
    }

    if (rawPayments) {
      // Group payments by month and calculate totals
      const monthlyTotals: Record<
        string,
        { time_period: string; total_amount: number; payment_count: number }
      > = {};
      rawPayments.forEach((payment) => {
        const date = new Date(payment.date);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = {
            time_period: monthKey,
            total_amount: 0,
            payment_count: 0,
          };
        }

        monthlyTotals[monthKey].total_amount += payment.amount;
        monthlyTotals[monthKey].payment_count += 1;
      });

      paymentsByMonth = Object.values(monthlyTotals).sort((a, b) =>
        a.time_period.localeCompare(b.time_period)
      );
    }
  }

  // Get payment distribution by sport
  const { data: sportStats, error: sportError } = await supabase.rpc(
    "get_payment_distribution_by_sport",
    { organization_filter: organizationId } // Add organization filter
  );

  if (sportError) {
    console.error("Error fetching sport payment stats:", sportError);
    throw new Error("Failed to fetch sport payment statistics");
  }

  // Calculate total payment stats from gender distribution
  const totalPayments =
    genderDistribution?.reduce(
      (sum: number, item: PaymentDistributionByGender) =>
        sum + item.payment_count,
      0
    ) || 0;
  const totalAmount =
    genderDistribution?.reduce(
      (sum: number, item: PaymentDistributionByGender) =>
        sum + item.total_amount,
      0
    ) || 0;
  const avgPayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

  const paymentStats = {
    total_payments: totalPayments,
    total_amount: totalAmount,
    avg_payment: avgPayment,
  };

  return {
    paymentStats,
    athleteCountByGender: athleteCountByGender || [],
    paymentsByMonth:
      paymentsByMonth?.map((item: PaymentTrend) => ({
        month: item.time_period,
        total: item.total_amount,
      })) || [],
    sportStats: sportStats || [],
  };
}

// Title IX Compliance Analysis Functions
export type TitleIXComplianceResult = {
  gender: string;
  payment_percentage: number;
  athlete_percentage: number;
  is_compliant: boolean;
};

export type PaymentDistributionByGender = {
  gender: string;
  total_amount: number;
  payment_count: number;
};

export type PaymentDistributionBySport = {
  sport_name: string;
  total_amount: number;
  payment_count: number;
};

export type PaymentTrend = {
  time_period: string;
  total_amount: number;
  payment_count: number;
};

// Check Title IX compliance status
export async function checkTitleIXCompliance(
  startDate?: string,
  endDate?: string
) {
  const supabase = getSupabase();
  const params: any = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const { data, error } = await supabase.rpc(
    "check_title_ix_compliance",
    params
  );

  if (error) {
    console.error("Error checking Title IX compliance:", error);
    throw new Error("Failed to check Title IX compliance");
  }

  return data as TitleIXComplianceResult[];
}

// Get payment distribution by gender
export async function getPaymentDistributionByGender(
  startDate?: string,
  endDate?: string
) {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    console.error('User does not belong to an organization');
    throw new Error('User does not belong to an organization');
  }
  
  console.log('Fetching gender distribution for organization:', organizationId);
  
  const params: any = {
    organization_filter: organizationId // Add organization filter
  };
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const { data, error } = await supabase.rpc(
    "get_payment_distribution_by_gender",
    params
  );

  if (error) {
    console.error("Error fetching payment distribution by gender:", error);
    throw new Error("Failed to fetch payment distribution by gender");
  }

  return data as PaymentDistributionByGender[];
}

// Get payment distribution by sport
export async function getPaymentDistributionBySport(
  startDate?: string,
  endDate?: string
) {
  const supabase = getSupabase();
  
  // Get the current user's organization_id
  const organizationId = await getCurrentUserOrganizationId();
  
  if (!organizationId) {
    console.error('User does not belong to an organization');
    throw new Error('User does not belong to an organization');
  }
  
  console.log('Fetching sport distribution for organization:', organizationId);
  
  const params: any = {
    organization_filter: organizationId // Add organization filter
  };
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const { data, error } = await supabase.rpc(
    "get_payment_distribution_by_sport",
    params
  );

  if (error) {
    console.error("Error fetching payment distribution by sport:", error);
    throw new Error("Failed to fetch payment distribution by sport");
  }

  return data as PaymentDistributionBySport[];
}

// Get payment trends
export async function getPaymentTrends(interval: string = "monthly") {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("get_payment_trends", {
    interval_type: interval,
  });

  if (error) {
    console.error("Error fetching payment trends:", error);
    throw new Error("Failed to fetch payment trends");
  }

  return data as PaymentTrend[];
}

// Demo request types and functions
export type DemoRequest = {
  id?: number;
  name: string;
  email: string;
  institution: string;
  phone_number?: string;
  preferred_time?: string;
  message?: string;
  created_at?: string;
};

// Create a new demo request
export async function createDemoRequest(
  demoRequest: Omit<DemoRequest, "id" | "created_at">
): Promise<DemoRequest> {
  try {
    // Check if table exists by trying to get schema
    const supabase = getSupabase();
    const { error: schemaError } = await supabase
      .from("demo_requests")
      .select("id")
      .limit(1);

    // If the table doesn't exist, store in localStorage instead
    if (schemaError && schemaError.code === "42P01") {
      // PostgreSQL code for undefined_table
      console.warn(
        "demo_requests table does not exist, storing in localStorage"
      );

      // Fallback to localStorage
      const demoRequests = JSON.parse(
        localStorage.getItem("demoRequests") || "[]"
      );
      const newRequest = {
        id: Date.now(),
        ...demoRequest,
        created_at: new Date().toISOString(),
      };
      demoRequests.push(newRequest);
      localStorage.setItem("demoRequests", JSON.stringify(demoRequests));

      return newRequest;
    }

    // If we got here, the table exists
    const { data, error } = await supabase
      .from("demo_requests")
      .insert([
        {
          ...demoRequest,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating demo request:", error);

      // Fallback to localStorage
      const demoRequests = JSON.parse(
        localStorage.getItem("demoRequests") || "[]"
      );
      const newRequest = {
        id: Date.now(),
        ...demoRequest,
        created_at: new Date().toISOString(),
      };
      demoRequests.push(newRequest);
      localStorage.setItem("demoRequests", JSON.stringify(demoRequests));

      return newRequest;
    }

    return data;
  } catch (err) {
    console.error("Error in createDemoRequest:", err);

    // Ultimate fallback
    const newRequest = {
      id: Date.now(),
      ...demoRequest,
      created_at: new Date().toISOString(),
    };

    try {
      const demoRequests = JSON.parse(
        localStorage.getItem("demoRequests") || "[]"
      );
      demoRequests.push(newRequest);
      localStorage.setItem("demoRequests", JSON.stringify(demoRequests));
    } catch (localStorageErr) {
      console.error("Failed to store in localStorage:", localStorageErr);
    }

    return newRequest as DemoRequest;
  }
}

// Get all demo requests
export async function getDemoRequests(): Promise<DemoRequest[]> {
  try {
    // Check if table exists by trying to get schema
    const supabase = getSupabase();
    const { error: schemaError } = await supabase
      .from("demo_requests")
      .select("id")
      .limit(1);

    // If the table doesn't exist, get from localStorage instead
    if (schemaError && schemaError.code === "42P01") {
      console.warn(
        "demo_requests table does not exist, retrieving from localStorage"
      );
      return JSON.parse(localStorage.getItem("demoRequests") || "[]");
    }

    // If we got here, the table exists
    const { data, error } = await supabase
      .from("demo_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching demo requests:", error);
      return JSON.parse(localStorage.getItem("demoRequests") || "[]");
    }

    return data || [];
  } catch (err) {
    console.error("Error in getDemoRequests:", err);

    // Fallback to localStorage
    try {
      return JSON.parse(localStorage.getItem("demoRequests") || "[]");
    } catch (localStorageErr) {
      console.error("Failed to retrieve from localStorage:", localStorageErr);
      return [];
    }
  }
}
