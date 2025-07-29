-- =================================================================
--  EvolvAI Database Schema
-- =================================================================
--  File: schema.sql
--  Description: This file contains the SQL statements to create
--               the necessary tables for the EvolvAI application.
-- =================================================================


-- =================================================================
--  Table: users
-- =================================================================
--  Description: Stores user account information.
-- =================================================================
CREATE TABLE IF NOT EXISTS users (
    -- Primary Key: A unique identifier for each user.
    -- UUID is a universally unique identifier, great for distributed systems.
    -- gen_random_uuid() function requires the pgcrypto extension.
    -- If pgcrypto is not enabled, you can use SERIAL PRIMARY KEY instead.
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User's full name.
    -- VARCHAR(255) is a variable-length string with a max of 255 characters.
    -- NOT NULL means this field cannot be empty.
    name VARCHAR(255) NOT NULL,

    -- User's email address.
    -- UNIQUE constraint ensures no two users can have the same email.
    -- NOT NULL means this field cannot be empty.
    email VARCHAR(255) UNIQUE NOT NULL,

    -- Hashed password for security.
    -- We store a hash of the password, never the plain text password.
    -- NOT NULL means this field cannot be empty.
    password_hash VARCHAR(255) NOT NULL,

    -- Timestamp of when the user account was created.
    -- TIMESTAMPTZ includes timezone information.
    -- DEFAULT CURRENT_TIMESTAMP automatically sets the creation time.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add an index on the email column for faster lookups.
-- This is highly recommended for performance.
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);


-- =================================================================
--  (Future tables like daily_logs, goals, etc. will be added here)
-- =================================================================

