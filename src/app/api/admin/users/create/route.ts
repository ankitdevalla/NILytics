import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { email, password, userData } = await request.json()
    const orgName = userData.organization

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Step 1: Create the user with initial metadata
    const { data: userResponse, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role
      }
    })

    if (userError || !userResponse.user) {
      console.error('Error creating user:', userError)
      return NextResponse.json({ error: userError?.message }, { status: 500 })
    }

    const userId = userResponse.user.id

    // Step 2: Insert into organizations table
    const { data: orgData, error: orgError } = await supabase.from('organizations').insert([
      {
        name: orgName,
        admin_user_id: userId,
      },
    ]).select()

    if (orgError) {
      console.error('Error creating organization:', orgError)
      return NextResponse.json({ error: orgError.message }, { status: 500 })
    }
    
    // Step 3: Update user metadata with organization info
    const orgId = orgData?.[0]?.id
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...userResponse.user.user_metadata,
          organization: orgName,
          organization_id: orgId
        }
      }
    )
    
    if (updateError) {
      console.error('Error updating user metadata:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ user: userResponse.user })

  } catch (error: any) {
    console.error('Error in create user API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
