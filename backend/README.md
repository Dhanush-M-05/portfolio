# Dhanush M Portfolio - Backend API

Production-ready backend for Dhanush M's developer portfolio and dynamic CMS. Built with Node.js, Express, MySQL, Prisma ORM, Cloudinary media storage, Resend transactional emails, and JWT authentication.

---

## 1. Technology Stack

- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs`
- **File & Media Storage**: Cloudinary SDK + Multer Memory Storage
- **Transactional Emails**: Resend API
- **Security**: Helmet, CORS Whitelisting, Express Rate Limiting
- **Validation**: Centralized input sanitization & validation

---

## 2. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000

# MySQL Connection URL
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/portfolio_db"

# JWT Authentication
JWT_SECRET="strong_random_secret_key"
JWT_EXPIRES_IN="7d"

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Resend Email Service
RESEND_API_KEY="re_xxxxxxxxx"
RESEND_FROM_EMAIL="onboarding@resend.dev"
CONTACT_RECEIVER_EMAIL="dhanush2005mp@gmail.com"

# Frontend Origin for CORS
FRONTEND_URL="http://localhost:5173"

NODE_ENV="development"
```

---

## 3. Local Development Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Run Migrations**:
   ```bash
   npx prisma migrate dev --name init
   # Or push schema directly:
   npx prisma db push
   ```

4. **Seed Database with Portfolio Content**:
   ```bash
   npm run prisma:seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

Backend server runs on `http://localhost:5000`. Test health:
`GET http://localhost:5000/api/health`

---

## 4. Production Deployment

### Backend on Render:
- **Build Command**: `npm install && npx prisma generate && npx prisma db push`
- **Start Command**: `npm start`
- **Environment Variables**: Add all `.env` variables in the Render dashboard.

### Frontend on Vercel:
- Set `VITE_API_BASE_URL=https://your-backend.onrender.com`

---

## 5. API Reference

### Health
- `GET /api/health` - Database connectivity & API status

### Authentication
- `POST /api/auth/login` - Admin login (email/password)
- `POST /api/auth/logout` - Invalidate session
- `GET /api/auth/me` - Current admin profile (Protected)
- `GET /api/auth/verify` - Token verification

### Content Management
- `GET /api/profile` / `PUT /api/profile`
- `POST /api/profile/image` (Cloudinary `portfolio/profile/`)
- `DELETE /api/profile/image`
- `GET /api/hero` / `PUT /api/hero`
- `GET /api/about` / `PUT /api/about`
- `GET /api/services` / `POST` / `PUT /:id` / `DELETE /:id`
- `GET /api/skills` / `POST` / `PUT /:id` / `DELETE /:id`
- `GET /api/projects` / `POST` / `PUT /:id` / `DELETE /:id`
- `GET /api/projects/slug/:slug` - Project details
- `POST /api/projects/:id/images` - Upload screenshot
- `GET /api/experience` / `POST` / `PUT /:id` / `DELETE /:id`
- `GET /api/education` / `POST` / `PUT /:id` / `DELETE /:id`
- `GET /api/certifications` / `POST` / `PUT /:id` / `DELETE /:id`
- `GET /api/certifications/:id/view` - Inline certificate preview
- `GET /api/achievements` / `POST` / `PUT /:id` / `DELETE /:id`
- `GET /api/resume` / `POST /api/resume` / `PUT /:id` / `DELETE /:id`
- `GET /api/resume/download` - Attachment download (`Dhanush-M-Resume.pdf`)
- `GET /api/resume/view` - In-browser inline preview
- `GET /api/social-links` / `POST` / `PUT /:id` / `DELETE /:id`
- `GET /api/navigation` / `POST` / `PUT /:id` / `DELETE /:id`
- `GET /api/footer` / `PUT /api/footer`
- `GET /api/settings` / `PUT /api/settings`
- `POST /api/contact` - Public inquiry submission (persists to MySQL + sends Resend email)
- `GET /api/contact` - Admin inbox
- `PATCH /api/contact/:id/read` - Mark read/unread
- `GET /api/homepage` (or `/api/sections`) - Reorder / toggle homepage sections
