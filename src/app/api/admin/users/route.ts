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
    
    // Get organizations to enhance user data
    const { data: orgsData, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, admin_user_id')
    
    if (orgsError) {
      console.error('Error fetching organizations:', orgsError)
      // Continue with just user data if orgs can't be fetched
    }
    
    // Create a map of user IDs to organizations
    const userOrgs = new Map()
    if (orgsData) {
      orgsData.forEach(org => {
        userOrgs.set(org.admin_user_id, {
          id: org.id,
          name: org.name
        })
      })
    }
    
    // Enhance user data with organization info
    const enhancedUsers = data.users.map(user => {
      const org = userOrgs.get(user.id)
      
      // If organization info isn't in metadata, add it from our query
      if (org && (!user.user_metadata?.organization || !user.user_metadata?.organization_id)) {
        return {
          ...user,
          user_metadata: {
            ...user.user_metadata,
            organization: org.name,
            organization_id: org.id
          }
        }
      }
      
      return user
    })
    
    return NextResponse.json({ users: enhancedUsers })
    
  } catch (error: any) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 