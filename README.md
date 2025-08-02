EvolvAI 🚀 — An Intelligent Companion for Personal Growth
<div align="center">

</div>

EvolvAI is a full-stack, AI-powered personal development platform designed to help users turn daily self-reflection into a clear, actionable roadmap for growth. It serves as an intelligent companion that analyzes daily journal entries to provide empathetic feedback, tracks progress towards long-term goals, and offers a dynamic, gamified experience to keep users motivated.

✨ Core Features
🔐 Secure User Authentication: Full authentication flow with JWT-based signup, login, and a secure, code-based password reset via email (powered by Resend).

🧠 AI-Powered Smart Journal: Users can journal in free-form text. The backend saves the entry and uses the Google Gemini API to provide an empathetic, personalized analysis of the user's mood and day, acting as a supportive friend.

🎯 Dynamic Goal Tracking: Users can create long-term goals. An integrated AI feature helps break down large goals into a checklist of small, actionable tasks.

💬 Interactive AI Chat: A secure, real-time chat interface where logged-in users can ask the AI questions about their progress and get personalized advice based on their own data.

📊 Dynamic Dashboard: A central hub that visualizes a user's real-time data, including mood trends, productivity scores, current streak, and main goal progress.

🏆 Gamified Rewards System: A dynamic leveling and XP system that rewards users for consistent positive actions like daily logging, completing tasks, and maintaining a positive mindset.

⚙️ Functional Settings: A complete settings page that allows users to manage their theme, export all their data as a JSON file, and securely delete all their information from the database.

🎨 Stunning UI/UX: A beautiful, modern interface built with Tailwind CSS and shadcn/ui, featuring a "glassmorphism" aesthetic, fluid animations, and a fully responsive design.

🛠️ Tech Stack & Architecture
The project is structured as a monorepo with a separate frontend and backend, which is a standard practice for scalable, full-stack applications.

Layer

Tools & Frameworks

Frontend

Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Framer Motion

Backend

Node.js, Express, TypeScript

Database

PostgreSQL

AI Integration

Google Gemini API (gemini-1.5-flash-latest)

Authentication

JSON Web Tokens (JWT), bcryptjs for hashing

Email Service

Resend API for transactional password reset emails

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Node.js (v18 or later)

npm or pnpm

A running PostgreSQL instance (e.g., via Docker, Neon, or a local installation)

A Google Gemini API Key

A Resend API Key

Installation & Setup
1. Clone the Repository

git clone https://github.com/your-username/EvolvAI.git
cd EvolvAI

2. Backend Setup

# Navigate to the Backend directory
cd Backend

# Install dependencies
npm install

# Create the environment file (e.g., copy from .env.example if it exists)
# cp .env.example .env 

Now, open a new .env file in the Backend directory and fill in your credentials (see the Environment Variables section below).

# Connect to your PostgreSQL database and run the SQL script located in:
# Backend/database/schema.sql 
# This will create all the necessary tables.

# Start the backend development server
npm run dev

The backend will now be running on http://localhost:8080.

3. Frontend Setup

# Navigate to the Frontend directory from the root
cd Frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev

The frontend will now be running on http://localhost:3000. Open this URL in your browser to use the application.

🔑 Environment Variables
The backend requires a .env file with the following keys:

# Your PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# The port for the backend server to run on
PORT=8080

# A long, random, and secure string for signing JWTs
JWT_SECRET="YOUR_JWT_SECRET"

# Your API key from Google AI Studio
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Your API key from Resend for sending emails
RESEND_API_KEY="YOUR_RESEND_API_KEY"

📝 API Endpoints
All API endpoints are prefixed with /api. Private routes require a valid JWT in the Authorization: Bearer <token> header.

Method

Endpoint

Description

Access

POST

/auth/register

Register a new user.

Public

POST

/auth/login

Log in and get a JWT.

Public

POST

/auth/forgot-password

Initiate password reset flow.

Public

POST

/auth/reset-password

Finalize password reset with a code.

Public

POST

/ai/chat

Send a message to the AI chat.

Private

GET

/logs

Get all journal logs for a user.

Private

POST

/logs

Create or update a journal log.

Private

POST

/logs/analyze

Get AI analysis for a journal log.

Private

GET

/goals

Get all goals and tasks for a user.

Private

POST

/goals

Create a new goal.

Private

POST

/goals/ai-generate-tasks

Generate tasks for a goal with AI.

Private

GET

/profile

Get user profile, stats, and level info.

Private

PUT

/profile

Update user profile (name, avatar).

Private

GET

/settings/export

Export all user data as JSON.

Private

DELETE

/settings/delete-all

Delete all of a user's data.

Private

GET

/dashboard

Get aggregated data for the dashboard.

Private

💡 Future Enhancements
Insights Page: A dedicated analytics page with long-term trend analysis and data correlation charts (e.g., sleep vs. productivity).

Blog Explorer: An AI-powered content recommendation engine that suggests articles based on a user's goals and recent mood.

Weekly AI Summaries: A feature to generate a comprehensive summary of the user's week, highlighting wins and areas for improvement.

📄 License
This project is licensed under the MIT License.
