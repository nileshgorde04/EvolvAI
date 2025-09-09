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
--  Table: daily_logs
-- =================================================================
--  Description: Stores the daily journal entries and associated metrics for each user.
-- =================================================================
CREATE TABLE IF NOT EXISTS daily_logs (
    -- Primary Key for the log entry
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign Key linking to the users table.
    -- ON DELETE CASCADE means if a user is deleted, all their logs are also deleted.
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- The date the log is for. We use DATE type for just the day.
    log_date DATE NOT NULL,

    -- The main content of the journal entry. TEXT allows for long-form writing.
    content TEXT,

    -- Metrics captured from the user interface
    mood INT, -- Stored as a number (e.g., 1-5)
    productivity_score INT, -- Stored as a number (e.g., 1-10)
    sleep_hours NUMERIC(4, 2), -- e.g., 7.5 hours
    water_intake INT, -- e.g., 8 glasses
    screen_time_hours NUMERIC(4, 2), -- e.g., 4.5 hours

    -- Emotional tags selected by the user, stored as an array of text.
    emotional_tags TEXT[],

    -- This will eventually hold the AI's analysis of the entry.
    ai_analysis JSONB,

    -- Timestamp of when the log was created or last updated.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    -- This constraint ensures that a user can only have one log per day.
    UNIQUE (user_id, log_date)
);

-- Add an index on user_id for faster querying of a user's logs.
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs(user_id);


-- =================================================================
--  Table: goals
-- =================================================================
--  Description: Stores the main goals for each user.
-- =================================================================
CREATE TABLE IF NOT EXISTS goals (
    -- Primary Key for the goal
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign Key linking to the users table.
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- The title of the goal (e.g., "Become a DevOps Engineer")
    title VARCHAR(255) NOT NULL,

    -- The status of the goal
    status VARCHAR(50) DEFAULT 'in_progress', -- e.g., in_progress, completed, archived

    -- Timestamp of when the goal was created.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add an index on user_id for quickly fetching all goals for a user.
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);


-- =================================================================
--  Table: tasks
-- =================================================================
--  Description: Stores the individual tasks associated with each goal.
-- =================================================================
CREATE TABLE IF NOT EXISTS tasks (
    -- Primary Key for the task
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign Key linking to the goals table.
    -- If a goal is deleted, all its associated tasks are also deleted.
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,

    -- The description of the task (e.g., "Learn Kubernetes")
    name VARCHAR(255) NOT NULL,

    -- Boolean to track if the task is completed or not.
    is_completed BOOLEAN DEFAULT FALSE,

    -- Timestamp of when the task was created.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add an index on goal_id for quickly fetching all tasks for a specific goal.
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON tasks(goal_id);
