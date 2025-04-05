import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This is a server-side API endpoint, so it's safe to use service role key here
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    // Create an admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Get all users
    const { data, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json(
        { error: 'Failed to fetch users' }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json({ users: data.users })
    
  } catch (error: any) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 