#  Student Activity Tracker

A full-stack web application to track student activities, built with **FastAPI** (Python) and **React** (Vite). Features JWT authentication, SQLite persistence, and a clean dashboard with charts and summaries.

---

##  Features

- **Authentication** — Register, login, logout with JWT access + refresh tokens
- **Activity Management** — Add, edit, delete, and search student activities
- **Dashboard** — Summary cards showing total entries, total hours, and top student
- **Summary Page** — Bar chart of hours by date using Recharts
- **Protected Routes** — All pages require authentication
- **Silent Token Refresh** — Axios interceptor auto-refreshes expired tokens
- **Pagination & Search** — Filter activities by name, student ID, or date

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router DOM v6 |
| Server State | TanStack Query v5 |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Charts | Recharts |
| Backend | FastAPI, Python 3.12+ |
| Database | SQLite (via aiosqlite) |
| Auth | JWT (python-jose), bcrypt |
| Validation | Pydantic v2 |

---

##  Project Structure

```
student-tracker/
├── backend/
│   ├── main.py          # FastAPI app, all route handlers
│   ├── auth.py          # JWT creation, verification, bcrypt hashing
│   ├── database.py      # SQLite connection, table creation
│   ├── schemas.py       # Pydantic request/response models
│   └── tracker.db       # SQLite database (auto-created)
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js         # Axios instance + interceptors
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        ├── components/
        │   ├── Layout.jsx
        │   ├── Sidebar.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Activities.jsx
            ├── ActivityForm.jsx
            └── Summary.jsx
```

---

## ⚙️ Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- npm

---

### Backend Setup

```bash
cd student-tracker/backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install fastapi uvicorn aiosqlite pydantic "pydantic[email]" python-jose "passlib[bcrypt]" bcrypt python-multipart

# Start the server
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
cd student-tracker/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive tokens |
| POST | `/auth/refresh` | Get new access token |
| GET | `/auth/me` | Get current user info |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/activities` | Add a new activity |
| GET | `/activities` | Get all activities (with search/filter/pagination) |
| PUT | `/activities/{id}` | Update an activity |
| DELETE | `/activities/{id}` | Delete an activity |

### Summary
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/summary` | Total entries, total hours, top student, hours by date |

---

##  Auth Flow

```
User logs in → receives access_token (15 min) + refresh_token (7 days)
       ↓
Access token stored in localStorage
       ↓
Every API request → Axios attaches token via request interceptor
       ↓
If 401 received → interceptor silently calls /auth/refresh
       ↓
New access token saved → original request retried automatically
```

---

##  Database Schema

```sql
users (
  id, username, email, hashed_password, created_at
)

activities (
  id, student_id, student_name, activity,
  hours, date, user_id, created_at
)
```

---

##  Running Tests (Manual)

1. Open `http://localhost:8000/docs`
2. Register a user via `POST /auth/register`
3. Login via `POST /auth/login` — copy the `access_token`
4. Click **Authorize** (top right) and paste the token
5. Test all activity and summary endpoints

---

##  Author

**Sarang** — Built as a full-stack intern assessment project.

---

##  License

MIT