# Dhanush M — Full-Stack Developer Portfolio

A modern, high-performance personal developer portfolio and content management system (CMS) built with a strict separation between frontend and backend.

- **Frontend**: Vite + React 18 + Vanilla CSS (Aesthetic glassmorphism, responsive micro-interactions, dark mode)
- **Backend**: Node.js + Express.js + Prisma ORM + MySQL (71/71 automated tests passing)
- **Database**: MySQL (`portfolio_db`) via Prisma ORM

---

## 📁 Repository Structure

```
portfolio/
├── frontend/                     # Pure React client application
│   ├── src/
│   │   ├── api/                  # Direct API helpers
│   │   ├── components/           # UI components (Buttons, Cards, Navbar, Modal, etc.)
│   │   ├── context/              # CMSContext & state management
│   │   ├── pages/                # Public & Admin pages
│   │   ├── sections/             # Home page sections (Hero, About, Projects, etc.)
│   │   ├── services/             # Dedicated API service modules (Axios client + JWT)
│   │   └── styles/               # Design tokens, variables & typography
│   ├── public/                   # Public static assets & images
│   ├── .env                      # Frontend environment configuration
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Production REST API server
│   ├── prisma/
│   │   ├── schema.prisma         # 18 comprehensive data models
│   │   └── seed.js               # Idempotent seed script
│   ├── src/
│   │   ├── config/               # Database client & environment variables
│   │   ├── controllers/          # 18 modular controllers
│   │   ├── middleware/           # Auth (JWT), Rate limiting, Uploads (Multer), Error handling
│   │   ├── routes/               # Modular REST endpoints
│   │   ├── utils/                # Standardized API response helpers
│   │   ├── app.js                # Express app configuration
│   │   └── server.js             # HTTP server entry point
│   ├── tests/
│   │   └── testSuite.js          # 71 automated integration tests
│   ├── uploads/                  # Uploaded assets & resumes
│   ├── .env                      # Backend environment configuration
│   ├── .env.example
│   └── package.json
│
├── .gitignore                    # Workspace ignore rules
├── package.json                  # Root orchestrator scripts
└── README.md                     # Documentation
```

---

## ⚙️ Prerequisites

- **Node.js**: v18+ (tested on Node v24)
- **MySQL**: 8.0+ running locally or cloud-hosted
- **npm**: v9+

---

## 🚀 Quick Start Guide

### 1. Database Setup & Seeding

1. Ensure MySQL is running on your machine:
   ```powershell
   Get-Service MySQL*
   ```
2. Create the database:
   ```sql
   CREATE DATABASE portfolio_db;
   ```
3. Configure `backend/.env` with your MySQL connection string:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/portfolio_db"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   CORS_ORIGIN="http://localhost:5173"
   ```
4. Push database schema and seed initial portfolio data:
   ```powershell
   cd backend
   npm install
   npx prisma db push
   npm run prisma:seed
   ```

### 2. Running the Full Application

You can run both sides from the workspace root or in separate terminals.

#### Option A: Workspace Root Commands

```powershell
# Run backend in background/separate terminal
npm run dev:backend

# Run frontend in separate terminal
npm run dev:frontend
```

#### Option B: Dedicated Folders

**Terminal 1 — Backend (Port 5000):**
```powershell
cd backend
npm run dev
```

**Terminal 2 — Frontend (Port 5173):**
```powershell
cd frontend
npm run dev
```

Visit the portfolio in your browser:
- **Public Portfolio**: [http://localhost:5173](http://localhost:5173)
- **Admin CMS Dashboard**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Backend API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Default Admin Credentials

Default credentials created by `prisma/seed.js`:

| Field | Value |
| --- | --- |
| **Email** | `admin@dhanush.dev` |
| **Password** | `Admin@12345` |

---

## 🧪 Testing & Verification

Run the automated backend test suite (71 comprehensive end-to-end tests covering authentication, CMS endpoints, file uploads, rate limiting, and contact forms):

```powershell
cd backend
npm test
```

Build the frontend for production:
```powershell
cd frontend
npm run build
```

---

## 📄 Resume Handling

- Public "Download Resume" buttons on the Hero, Navbar, About, and Resume sections download directly from `GET /api/resume/download`.
- The backend serves the binary PDF with `Content-Disposition: attachment; filename="Dhanush-M-Resume.pdf"` and `Content-Type: application/pdf`.
- Administrators can upload an updated PDF via the Admin CMS at `/admin/resume`, which automatically switches the active document in MySQL.
