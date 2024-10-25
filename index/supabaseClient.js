//supabaseClient.js
require('dotenv').config(); // Load environment variables
const { createClient } = require('@supabase/supabase-js');

// Ensure you have the correct environment variables in your .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key must be provided.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
