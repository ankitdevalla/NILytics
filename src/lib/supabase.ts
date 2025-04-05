import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from './auth'

// Define your Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Use the same Supabase client across the app
export const getSupabase = () => {
  return createClientComponentClient()
}

export type Sport = {
  id: number
  name: string
  created_at: string
}

export type Athlete = {
  id: number
  name: string
  gender: string
  year: string
  sport_id: number
  created_at: string
  sport?: Sport
}

export type Payment = {
  id: number
  athlete_id: number
  amount: number
  date: string
  source: string
  activity_type: string
  created_at: string
  athlete?: Athlete & { sport?: Sport }
}

export async function fetchSports(): Promise<Sport[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('sports')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching sports:', error)
    throw new Error('Failed to fetch sports')
  }

  return data || []
}

export async function fetchAthletes(): Promise<Athlete[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching athletes:', error)
    throw new Error('Failed to fetch athletes')
  }

  return data || []
}

export async function fetchAthletesWithSport(): Promise<(Athlete & { sport: Sport })[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('athletes')
    .select(`
      *,
      sport:sports(*)
    `)
    .order('name')

  if (error) {
    console.error('Error fetching athletes with sport:', error)
    throw new Error('Failed to fetch athletes with sport')
  }

  return data || []
}

export async function fetchPayments(): Promise<Payment[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching payments:', error)
    throw new Error('Failed to fetch payments')
  }

  return data || []
}

export async function fetchPaymentsWithDetails(): Promise<Payment[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      athlete:athletes(
        *,
        sport:sports(*)
      )
    `)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching payments with details:', error)
    throw new Error('Failed to fetch payments with details')
  }

  return data || []
}

export async function fetchAthleteById(id: number): Promise<Athlete & { sport: Sport }> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('athletes')
    .select(`
      *,
      sport:sports(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching athlete with ID ${id}:`, error)
    throw new Error(`Failed to fetch athlete with ID ${id}`)
  }

  return data
}

export async function fetchPaymentById(id: number): Promise<Payment & { athlete: Athlete & { sport: Sport } }> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      athlete:athletes(
        *,
        sport:sports(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching payment with ID ${id}:`, error)
    throw new Error(`Failed to fetch payment with ID ${id}`)
  }

  return data
}

export async function fetchPaymentsByAthleteId(athleteId: number): Promise<Payment[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('date', { ascending: false })

  if (error) {
    console.error(`Error fetching payments for athlete ID ${athleteId}:`, error)
    throw new Error(`Failed to fetch payments for athlete ID ${athleteId}`)
  }

  return data || []
}

export async function createAthlete(athlete: Omit<Athlete, 'id' | 'created_at'>): Promise<Athlete> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('athletes')
    .insert([athlete])
    .select()
    .single()

  if (error) {
    console.error('Error creating athlete:', error)
    throw new Error('Failed to create athlete')
  }

  return data
}

export async function createPayment(payment: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .select()
    .single()

  if (error) {
    console.error('Error creating payment:', error)
    throw new Error('Failed to create payment')
  }

  return data
}

export async function updateAthlete(
  id: number, 
  updates: Partial<Omit<Athlete, 'id' | 'created_at'>>
): Promise<Athlete> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('athletes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating athlete ID ${id}:`, error)
    throw new Error(`Failed to update athlete ID ${id}`)
  }

  return data
}

export async function updatePayment(
  id: number, 
  updates: Partial<Omit<Payment, 'id' | 'created_at'>>
): Promise<Payment> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating payment ID ${id}:`, error)
    throw new Error(`Failed to update payment ID ${id}`)
  }

  return data
}

export async function deleteAthlete(id: number): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('athletes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting athlete ID ${id}:`, error)
    throw new Error(`Failed to delete athlete ID ${id}`)
  }
}

export async function deletePayment(id: number): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting payment ID ${id}:`, error)
    throw new Error(`Failed to delete payment ID ${id}`)
  }
}

export async function fetchDashboardStats() {
  const supabase = getSupabase()
  // Get payment distribution by gender (for gender stats)
  const { data: genderDistribution, error: genderError } = await supabase.rpc('get_payment_distribution_by_gender')
  
  if (genderError) {
    console.error('Error fetching payment distribution by gender:', genderError)
    throw new Error('Failed to fetch payment distribution by gender')
  }

  // Get athlete count by gender
  const { data: athleteCountByGender, error: athleteError } = await supabase
    .from('athletes')
    .select('gender')
    .then(result => {
      if (result.error) throw result.error;
      
      // Group the athletes by gender and count them
      const genderCounts: { gender: string; count: number }[] = [];
      const genderMap: Record<string, number> = {};
      
      result.data?.forEach(athlete => {
        const gender = athlete.gender;
        if (!genderMap[gender]) {
          genderMap[gender] = 0;
        }
        genderMap[gender]++;
      });
      
      // Convert the map to array format
      Object.keys(genderMap).forEach(gender => {
        genderCounts.push({ gender, count: genderMap[gender] });
      });
      
      return { data: genderCounts, error: null };
    });
  
  if (athleteError) {
    console.error('Error fetching athlete gender stats:', athleteError)
    throw new Error('Failed to fetch athlete gender statistics')
  }
  
  // Get payment distribution by month using get_payment_trends
  const { data: paymentsByMonth, error: monthlyError } = await supabase.rpc('get_payment_trends', { 
    interval_type: 'monthly' 
  })
  
  if (monthlyError) {
    console.error('Error fetching monthly payment data:', monthlyError)
    throw new Error('Failed to fetch monthly payment data')
  }
  
  // Get payment distribution by sport
  const { data: sportStats, error: sportError } = await supabase.rpc('get_payment_distribution_by_sport')
  
  if (sportError) {
    console.error('Error fetching sport payment stats:', sportError) 
    throw new Error('Failed to fetch sport payment statistics')
  }
  
  // Calculate total payment stats from gender distribution
  const totalPayments = genderDistribution?.reduce((sum: number, item: PaymentDistributionByGender) => sum + item.payment_count, 0) || 0
  const totalAmount = genderDistribution?.reduce((sum: number, item: PaymentDistributionByGender) => sum + item.total_amount, 0) || 0
  const avgPayment = totalPayments > 0 ? totalAmount / totalPayments : 0
  
  const paymentStats = {
    total_payments: totalPayments,
    total_amount: totalAmount,
    avg_payment: avgPayment
  }
  
  return {
    paymentStats,
    athleteCountByGender: athleteCountByGender || [],
    paymentsByMonth: paymentsByMonth?.map((item: PaymentTrend) => ({
      month: item.time_period,
      total: item.total_amount
    })) || [],
    sportStats: sportStats || []
  }
}

// Title IX Compliance Analysis Functions
export type TitleIXComplianceResult = {
  gender: string
  payment_percentage: number
  athlete_percentage: number
  is_compliant: boolean
}

export type PaymentDistributionByGender = {
  gender: string
  total_amount: number
  payment_count: number
}

export type PaymentDistributionBySport = {
  sport_name: string
  total_amount: number
  payment_count: number
}

export type PaymentTrend = {
  time_period: string
  total_amount: number
  payment_count: number
}

// Check Title IX compliance status
export async function checkTitleIXCompliance(startDate?: string, endDate?: string) {
  const supabase = getSupabase()
  const params: any = {}
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate
  
  const { data, error } = await supabase.rpc('check_title_ix_compliance', params)
  
  if (error) {
    console.error('Error checking Title IX compliance:', error)
    throw new Error('Failed to check Title IX compliance')
  }
  
  return data as TitleIXComplianceResult[]
}

// Get payment distribution by gender
export async function getPaymentDistributionByGender(startDate?: string, endDate?: string) {
  const supabase = getSupabase()
  const params: any = {}
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate
  
  const { data, error } = await supabase.rpc('get_payment_distribution_by_gender', params)
  
  if (error) {
    console.error('Error fetching payment distribution by gender:', error)
    throw new Error('Failed to fetch payment distribution by gender')
  }
  
  return data as PaymentDistributionByGender[]
}

// Get payment distribution by sport
export async function getPaymentDistributionBySport(startDate?: string, endDate?: string) {
  const supabase = getSupabase()
  const params: any = {}
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate
  
  const { data, error } = await supabase.rpc('get_payment_distribution_by_sport', params)
  
  if (error) {
    console.error('Error fetching payment distribution by sport:', error)
    throw new Error('Failed to fetch payment distribution by sport')
  }
  
  return data as PaymentDistributionBySport[]
}

// Get payment trends
export async function getPaymentTrends(interval: string = 'monthly') {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc('get_payment_trends', { interval_type: interval })
  
  if (error) {
    console.error('Error fetching payment trends:', error)
    throw new Error('Failed to fetch payment trends')
  }
  
  return data as PaymentTrend[]
}

// Demo request types and functions
export type DemoRequest = {
  id?: number
  name: string
  email: string
  institution: string
  phone_number?: string
  preferred_time?: string
  message?: string
  created_at?: string
}

// Create a new demo request
export async function createDemoRequest(demoRequest: Omit<DemoRequest, 'id' | 'created_at'>): Promise<DemoRequest> {
  try {
    // Check if table exists by trying to get schema
    const supabase = getSupabase()
    const { error: schemaError } = await supabase
      .from('demo_requests')
      .select('id')
      .limit(1);
    
    // If the table doesn't exist, store in localStorage instead
    if (schemaError && schemaError.code === '42P01') { // PostgreSQL code for undefined_table
      console.warn('demo_requests table does not exist, storing in localStorage');
      
      // Fallback to localStorage
      const demoRequests = JSON.parse(localStorage.getItem('demoRequests') || '[]');
      const newRequest = {
        id: Date.now(),
        ...demoRequest,
        created_at: new Date().toISOString()
      };
      demoRequests.push(newRequest);
      localStorage.setItem('demoRequests', JSON.stringify(demoRequests));
      
      return newRequest;
    }
    
    // If we got here, the table exists
    const { data, error } = await supabase
      .from('demo_requests')
      .insert([{
        ...demoRequest,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating demo request:', error);
      
      // Fallback to localStorage
      const demoRequests = JSON.parse(localStorage.getItem('demoRequests') || '[]');
      const newRequest = {
        id: Date.now(),
        ...demoRequest,
        created_at: new Date().toISOString()
      };
      demoRequests.push(newRequest);
      localStorage.setItem('demoRequests', JSON.stringify(demoRequests));
      
      return newRequest;
    }
    
    return data;
  } catch (err) {
    console.error('Error in createDemoRequest:', err);
    
    // Ultimate fallback
    const newRequest = {
      id: Date.now(),
      ...demoRequest,
      created_at: new Date().toISOString()
    };
    
    try {
      const demoRequests = JSON.parse(localStorage.getItem('demoRequests') || '[]');
      demoRequests.push(newRequest);
      localStorage.setItem('demoRequests', JSON.stringify(demoRequests));
    } catch (localStorageErr) {
      console.error('Failed to store in localStorage:', localStorageErr);
    }
    
    return newRequest as DemoRequest;
  }
}

// Get all demo requests
export async function getDemoRequests(): Promise<DemoRequest[]> {
  try {
    // Check if table exists by trying to get schema
    const supabase = getSupabase()
    const { error: schemaError } = await supabase
      .from('demo_requests')
      .select('id')
      .limit(1);
    
    // If the table doesn't exist, get from localStorage instead
    if (schemaError && schemaError.code === '42P01') {
      console.warn('demo_requests table does not exist, retrieving from localStorage');
      return JSON.parse(localStorage.getItem('demoRequests') || '[]');
    }
    
    // If we got here, the table exists
    const { data, error } = await supabase
      .from('demo_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching demo requests:', error);
      return JSON.parse(localStorage.getItem('demoRequests') || '[]');
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getDemoRequests:', err);
    
    // Fallback to localStorage
    try {
      return JSON.parse(localStorage.getItem('demoRequests') || '[]');
    } catch (localStorageErr) {
      console.error('Failed to retrieve from localStorage:', localStorageErr);
      return [];
    }
  }
} 