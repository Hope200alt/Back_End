const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Test connection
pool.connect()
    .then(client => {
        console.log('📦 PostgreSQL database connection established');
        client.release(); // release back to pool
    })
    .catch(err => {
        console.error('❌ PostgreSQL database connection failed:', err);
    });

module.exports = pool;
// Export the pool for use in other modules