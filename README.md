# Hostel Management System

A full‑stack web application for managing hostels, rooms, and bookings.
Built with **Node.js + Express** (backend) and **Next.js (App Router)** (frontend).

## Features

- User authentication (student, admin roles)
- Hostel and room management
- Booking system
- Role‑based dashboards (student, admin)
- Responsive UI with Tailwind CSS

## Tech Stack

**Backend**
- Node.js, Express
- MySQL (or your DB)
- JWT for authentication
- bcryptjs for password hashing

**Frontend**
- Next.js (App Router)
- Tailwind CSS
- Context API for auth state

## Project Structure

```
.
├── backend/          # Express API
│   ├── config/       # DB connection
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth, error handling
│   └── routes/       # API endpoints
├── frontend/         # Next.js app
│   ├── app/          # App router pages
│   ├── components/   # Reusable UI
│   ├── context/      # AuthContext
│   └── lib/          # API client
└── database/         # SQL schema / seeds
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL (or your database)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # configure DB credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

**Backend (.env)**
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hostel_db
JWT_SECRET=your_jwt_secret
```

**Frontend** – uses `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

## License

MIT
