// supabaseClient.js

require('dotenv').config(); // Load environment variables first
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL; // Get Supabase URL
const supabaseKey = process.env.ANON_KEY; // Get Supabase Key

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key must be provided.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
