# 🛠️ Tech Stack & Architecture

## Project Structure

The project is structured as a **monorepo** with a separate frontend and backend, which is a standard practice for scalable, full-stack applications.

-   `/Frontend`: A Next.js 14 application responsible for the entire user interface and user experience.
-   `/Backend`: A Node.js and Express server that handles business logic, database interactions, and communication with external AI services.

## Technology Stack

| Layer            | Tools & Frameworks                                                              |
| :--------------- | :------------------------------------------------------------------------------ |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Framer Motion     |
| **Backend** | Node.js, Express, TypeScript                                                    |
| **Database** | PostgreSQL                                                                      |
| **AI Integration** | Google Gemini API (`gemini-1.5-flash-latest`)                                   |
| **Authentication** | JSON Web Tokens (JWT), `bcryptjs` for hashing                                   |
| **Email Service** | Resend API for transactional password reset emails                              |

## Database Schema

The following tables are used in the `evolvAI` PostgreSQL database.

### `users` Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    profile_picture_url TEXT,
```

### `daily logs` Table
```sql

CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    content TEXT,
    mood INT,
    -- ... and other metrics
    UNIQUE (user_id, log_date)
);

```

### `goals and tasks` Table
```sql

CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    -- ... and other fields
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE
);
```

    reset_password_token TEXT,
    reset_password_expires TIMESTAMPTZ
);
