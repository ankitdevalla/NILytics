import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client singleton
let clientInstance: ReturnType<typeof createClient> | null = null

// Client-side Supabase client (for browser)
export const createClientComponentClient = () => {
  if (typeof window !== 'undefined') {
    if (!clientInstance) {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      })
    }
    return clientInstance
  }
  
  // For server-side, always create a new instance
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  })
}

// Get the current user session
export const getSession = async () => {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  return data.session
}

// Get the current user
export const getUser = async () => {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return data.user
}

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Sign out
export const signOut = async () => {
  const supabase = createClientComponentClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
  
  // Reset the client instance after sign out
  if (typeof window !== 'undefined') {
    clientInstance = null
  }
  
  window.location.href = '/signin'
  return true
}

// Reset password with email
export const resetPassword = async (email: string) => {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Update user password
export const updatePassword = async (password: string) => {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase.auth.updateUser({
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Check if the current user is an admin
export const isAdmin = async (): Promise<boolean> => {
  try {
    const user = await getUser()
    if (!user) return false
    
    // Check if user metadata has admin role
    return user.user_metadata?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Create new user (admin only) - This should be used in a server context
export const createUser = async (email: string, password: string, userData: any) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userData
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Update user metadata (admin only) - This should be used in a server context
export const updateUserMetadata = async (userId: string, metadata: any) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    { user_metadata: metadata }
  )
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Get all users (admin only) - This should be used in a server context
export const getAllUsers = async () => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  const { data, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data.users
}

// Get user by ID
export const getUserById = async (userId: string) => {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const supabase = createClientComponentClient()
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
} 