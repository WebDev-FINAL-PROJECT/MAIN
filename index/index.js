// index.js

const { connectToDatabase } = require('./dbClient');

async function main() {
    await connectToDatabase();
    // You can now perform database operations here
}

main();
