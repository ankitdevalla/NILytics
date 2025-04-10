import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Defined' : '❌ Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Defined' : '❌ Missing',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Defined' : '❌ Missing',
  }
  
  // Return the status of environment variables
  return NextResponse.json({
    message: 'Environment variable status',
    env: envVars,
    nodeEnv: process.env.NODE_ENV,
  })
} 