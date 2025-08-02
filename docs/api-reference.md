# 📝 API Endpoints

All API endpoints are prefixed with `/api`. Private routes require a valid JWT in the `Authorization: Bearer <token>` header.

| Method   | Endpoint                      | Description                                | Access  |
| :------- | :---------------------------- | :----------------------------------------- | :------ |
| `POST`   | `/auth/register`              | Register a new user.                       | Public  |
| `POST`   | `/auth/login`                 | Log in and get a JWT.                      | Public  |
| `POST`   | `/auth/forgot-password`       | Initiate password reset flow.              | Public  |
| `POST`   | `/auth/reset-password`        | Finalize password reset with a code.       | Public  |
| `POST`   | `/ai/chat`                    | Send a message to the AI chat.             | Private |
| `GET`    | `/logs`                       | Get all journal logs for a user.           | Private |
| `POST`   | `/logs`                       | Create or update a journal log.            | Private |
| `POST`   | `/logs/analyze`               | Get AI analysis for a journal log.         | Private |
| `GET`    | `/goals`                      | Get all goals and tasks for a user.        | Private |
| `POST`   | `/goals`                      | Create a new goal.                         | Private |
| `POST`   | `/goals/ai-generate-tasks`    | Generate tasks for a goal with AI.         | Private |
| `GET`    | `/profile`                    | Get user profile, stats, and level info.   | Private |
| `PUT`    | `/profile`                    | Update user profile (name, avatar).        | Private |
| `GET`    | `/settings/export`            | Export all user data as JSON.              | Private |
| `DELETE` | `/settings/delete-all`        | Delete all of a user's data.               | Private |
| `GET`    | `/dashboard`                  | Get aggregated data for the dashboard.     | Private |
