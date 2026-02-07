require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseServiceKey && supabaseUrl !== 'https://your-project.supabase.co' && supabaseServiceKey !== 'your-service-role-key') {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('Supabase connected successfully');
} else {
  console.warn('Supabase configuration not set. Using mock data for development.');
  // 创建一个模拟的supabase对象，用于开发环境
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      eq: () => ({ select: () => ({ data: [], error: null }), single: () => ({ data: null, error: { code: 'PGRST116' } }) }),
      single: () => ({ data: null, error: { code: 'PGRST116' } }),
      order: () => ({ data: [], error: null }),
      limit: () => ({ data: [], error: null })
    }),
    rpc: () => ({ error: null })
  };
}

module.exports = supabase;