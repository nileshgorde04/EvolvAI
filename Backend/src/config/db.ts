import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a new connection pool using the DATABASE_URL from the .env file
// The Pool manages multiple client connections for better performance and reliability.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * A function to test the database connection.
 * It connects to the database, runs a simple query, and logs the result.
 */
export const testDBConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('[database]: Connected to PostgreSQL database successfully!');
    // Query to get the current time from the database server to confirm connection
    const res = await client.query('SELECT NOW()');
    console.log(`[database]: Test query result: ${res.rows[0].now}`);
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error('[database]: Unable to connect to the database.');
    console.error(error);
    // Exit the process with a failure code if the database connection fails.
    // This is important for containerized environments to signal a crash loop.
    process.exit(1);
  }
};

// Export the pool so we can use it to run queries in other parts of our application
export default pool;
