const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateUserToAdmin() {
  const userId = 'f977697b-03e4-4f9d-b24c-f96ea34145c2'; // The user ID from your screenshot
  
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        user_metadata: { 
          role: 'admin',
          organization: 'NILytics',
          name: 'Admin User' 
        } 
      }
    );
    
    if (error) {
      throw error;
    }
    
    console.log('User updated successfully to admin role:');
    console.log(data);
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

updateUserToAdmin(); 