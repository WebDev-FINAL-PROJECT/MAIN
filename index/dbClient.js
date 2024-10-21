// dbClient.js

const { Client } = require('pg');

// Replace the connection string with your actual string from Supabase
const connectionString = 'postgresql://postgres.gkdpppcubywispbfdd:[Supabase1122]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString: connectionString,
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to the database successfully!');
    } catch (error) {
        console.error('Database connection error:', error.stack);
    }
}

// Export the client and connection function
module.exports = { client, connectToDatabase };
