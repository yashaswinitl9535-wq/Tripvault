# 🌍 TripVault — MERN Authentication Project

TripVault is a travel memory journal foundation built for the CodGen Virtual Internship Program, Week 1. The Week 1 requirements are implemented as a complete MERN application: Express + MongoDB backend, React + Vite frontend, bcrypt password hashing, JWT authentication, protected `/api/auth/me`, and protected Dashboard routing.

## Features

- User registration with name, email and password
- Password hashing with bcryptjs
- User login with JWT token
- Protected `GET /api/auth/me` endpoint
- React pages for Login, Register and Dashboard
- React Router navigation and protected dashboard
- Axios API client with automatic JWT header
- MongoDB Atlas support
- Environment variables kept out of GitHub
- Clean `/server` and `/client` structure

## Project structure

```text
tripvault/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── middleware/authMiddleware.js
│   ├── models/User.js
│   ├── routes/auth.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── .gitignore
└── README.md
```

## Requirements

Install Node.js 18+ and create a free MongoDB Atlas database.

## 1. Configure MongoDB

Create a MongoDB Atlas cluster and database named `tripvault`. Copy your connection string.

Inside `server`, copy `.env.example` to `.env` and replace the values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

**Never upload `server/.env` to GitHub.** It is already excluded by `.gitignore`.

## 2. Install backend

```bash
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

## 3. Install frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## 4. Test the complete flow

1. Open Register.
2. Create a new account.
3. Login with the same credentials.
4. The JWT is stored in localStorage.
5. Dashboard opens only with a valid token.
6. The app calls `/api/auth/me` to load the logged-in user.
7. Logout removes the token and returns to Login.

## API endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/` | No | API health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/me` | Bearer JWT | Get logged-in user |

## GitHub upload

From the `tripvault` folder:

```bash
git init
git add .
git commit -m "Initial TripVault MERN project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tripvault.git
git push -u origin main
```

Create the GitHub repository with the exact name `tripvault` and make it **Public**, as required by the Week 1 brief.

## Important

Do not commit `node_modules`, `server/.env`, database passwords, JWT secrets, or other credentials.

## Week 1 requirement mapping

- Express server on port 5000: implemented
- MongoDB connection: implemented
- User model: implemented
- Register route: implemented
- Login route: implemented
- JWT authentication: implemented
- bcrypt hashing: implemented
- Protected `/api/auth/me`: implemented
- React + Vite frontend: implemented
- Register/Login/Dashboard pages: implemented
- Protected Dashboard: implemented
- `/server` + `/client` structure: implemented
