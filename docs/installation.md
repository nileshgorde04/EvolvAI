# 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

-   Node.js (v18 or later)
-   npm or pnpm
-   A running PostgreSQL instance (e.g., via Docker, Neon, or a local installation)
-   A Google Gemini API Key
-   A Resend API Key

## Installation & Setup

### 1. Clone the Repository

```bash
https://github.com/nileshgorde04/EvolvAI.git
cd EvolvAI
```
### Navigate to the Backend directory
cd Backend

### Install dependencies
npm install

### Create the environment file
### cp .env.example .env

### Connect to your PostgreSQL database and run the SQL script located in:
### Backend/database/schema.sql 
### This will create all the necessary tables.

# Start the backend development server
npm run dev

### Navigate to the Frontend directory from the root
cd Frontend

### Install dependencies
npm install

### Start the frontend development server
npm run dev

### Your PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

### The port for the backend server to run on
PORT=8080

### A long, random, and secure string for signing JWTs
JWT_SECRET="YOUR_JWT_SECRET"

### Your API key from Google AI Studio
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

### Your API key from Resend for sending emails
RESEND_API_KEY="YOUR_RESEND_API_KEY"

