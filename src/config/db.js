import pkg from 'pg';
const { Pool } = pkg;

// Use process.env.DB_URL from your Render environment variables
const pool = new Pool({
    connectionString: process.env.DB_URL,
    // Required for cloud databases in production (Render, Supabase, Neon, etc.)
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default pool;