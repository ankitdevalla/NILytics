import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { userId, metadata } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      )
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    // Create an admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Update user metadata
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: metadata }
    )
    
    if (error) {
      console.error('Error updating user role:', error)
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json({ user: data.user })
    
  } catch (error: any) {
    console.error('Error in update user role API:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 