# Dhanush M — Portfolio CMS Backend

A production-ready, secure REST API backend for a personal developer portfolio CMS, built using **Node.js**, **Express.js**, **Prisma ORM**, and **MySQL**.

---

## Architecture Overview

```
React Frontend (Vite)
        │
      Axios
        │
   REST API (JSON / Multipart)
        ▼
   Node.js / Express.js Backend
   ├── Security: Helmet, CORS, Rate Limiters
   ├── Authentication: JWT + bcryptjs
   ├── File Handling: Multer (MIME & Extension validated)
   ├── Services & Transactions: Prisma Transactions
   └── Centralized Error Handling
        │
   Prisma ORM (Singleton PrismaClient)
        │
   MySQL Database (Cloud or Local)
```

- **Single Source of Truth**: The MySQL database powers both the public website (via public `GET` APIs) and the private admin dashboard (via authenticated `POST`, `PUT`, `PATCH`, `DELETE` APIs).
- **No Frontend Rebuild Required**: Any content modified via the Admin Dashboard is instantly reflected on the portfolio.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js** (v18+) | JavaScript server runtime environment |
| **Express.js** (v4.x) | Web framework and REST API routing |
| **Prisma ORM** (v6.x) | Type-safe ORM for schema definitions, migrations, and queries |
| **MySQL 8.0** | Relational database (compatible with Railway, Aiven, PlanetScale, AWS RDS) |
| **JSON Web Tokens (JWT)** | Stateless authentication for protected admin CMS operations |
| **bcryptjs** | Salted password hashing (12 rounds) |
| **Multer** | Multipart file upload handling with strict MIME and extension filters |
| **express-rate-limit** | Brute-force protection for login and spam protection for contact form |
| **express-validator** | Request payload validation and sanitization |
| **Helmet & CORS** | Security HTTP response headers and origin filtering |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Singleton Prisma client with connection verification & graceful shutdown
│   │   ├── environment.js       # Validated environment variables (PORT, DATABASE_URL, etc.)
│   │   └── multer.js            # Multer storage, MIME filters (PDF, Images) and file size limits
│   │
│   ├── controllers/             # 18 Modular controllers using asyncHandler
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── heroController.js
│   │   ├── aboutController.js
│   │   ├── serviceController.js
│   │   ├── skillController.js
│   │   ├── projectController.js
│   │   ├── experienceController.js
│   │   ├── educationController.js
│   │   ├── certificationController.js
│   │   ├── achievementController.js
│   │   ├── resumeController.js
│   │   ├── socialController.js
│   │   ├── navigationController.js
│   │   ├── footerController.js
│   │   ├── settingsController.js
│   │   ├── contactController.js
│   │   └── healthController.js
│   │
│   ├── routes/                  # 18 Clean REST route modules
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── heroRoutes.js
│   │   ├── aboutRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── experienceRoutes.js
│   │   ├── educationRoutes.js
│   │   ├── certificationRoutes.js
│   │   ├── achievementRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── socialRoutes.js
│   │   ├── navigationRoutes.js
│   │   ├── footerRoutes.js
│   │   ├── settingsRoutes.js
│   │   ├── contactRoutes.js
│   │   └── healthRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT token extraction & verification
│   │   ├── validationMiddleware.js  # Express-validator error formatting (422)
│   │   ├── uploadMiddleware.js      # Multer error interceptor
│   │   ├── rateLimitMiddleware.js   # Global, Login, and Contact rate limits
│   │   └── errorMiddleware.js       # Centralized error handler (Prisma, JWT, 404, 500)
│   │
│   ├── services/
│   │   ├── fileService.js           # Abstracted file management & streaming
│   │   └── resumeService.js         # Resume transaction logic & PDF stream download
│   │
│   ├── validators/                  # Request payload validation schemas
│   │   ├── authValidator.js
│   │   ├── profileValidator.js
│   │   ├── projectValidator.js
│   │   ├── certificationValidator.js
│   │   ├── resumeValidator.js
│   │   └── contactValidator.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js           # Standard API response formatting
│   │   ├── asyncHandler.js          # Async wrapper for unhandled promises
│   │   └── slugGenerator.js         # URL-friendly slug generator with uniqueness guarantee
│   │
│   ├── app.js                       # Express configuration, middlewares & routes
│   └── server.js                    # HTTP listener & process lifecycle management
│
├── prisma/
│   ├── schema.prisma                # 18 Prisma models with relations, indexes, and constraints
│   └── seed.js                      # Idempotent seed script with bcrypt admin & full CMS data
│
├── uploads/                         # Dedicated upload directories
│   ├── resumes/
│   ├── certifications/
│   ├── profiles/
│   └── projects/
│
├── tests/
│   └── testSuite.js                 # 71 Automated end-to-end endpoint tests
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Environment Variables

Copy `.env.example` to `.env` inside `backend/`:

```env
PORT=5000

# MySQL Database Connection String (Local or Cloud MySQL)
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# JWT Secret & Expiration
JWT_SECRET="CHANGE_THIS_TO_A_LONG_RANDOM_SECRET"
JWT_EXPIRES_IN="1d"

# Allowed Frontend Origins (Comma-separated for multiple origins)
FRONTEND_URL="http://localhost:5173"

# Node Environment
NODE_ENV="development"

# Initial Admin Credentials (used by prisma/seed.js)
ADMIN_NAME="Dhanush M"
ADMIN_EMAIL="dhanush2005mp@gmail.com"
ADMIN_PASSWORD="CHANGE_THIS_PASSWORD"

# Email Notification Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-gmail-app-password"
CONTACT_RECEIVER_EMAIL="dhanush2005mp@gmail.com"

# Cloudinary Persistent File Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Cloudinary Storage Folders

| Asset Type | Cloudinary Folder | Resource Type | Description |
| :--- | :--- | :--- | :--- |
| **Profile Photo** | `portfolio/profile` | `image` | Dhanush's avatar photo |
| **Project Images** | `portfolio/projects` | `image` | Project screenshots and diagrams |
| **Certifications** | `portfolio/certificates` | `raw` (PDF) / `image` | Course and certification credentials |
| **Resume** | `portfolio/resume` | `raw` | Publicly downloadable & previewable PDF |

> **Security Note:** Never commit `.env` to Git. `.env` is ignored by default in `.gitignore`.

---

## Database & Prisma Setup

### 1. Cloud MySQL Configuration
The backend works seamlessly with any cloud MySQL provider:
- **Railway**: Provision a MySQL database and copy the `DATABASE_URL`.
- **Aiven**: Create a free MySQL service, copy the URI.
- **PlanetScale / AWS RDS / Clever Cloud**: Set `DATABASE_URL="mysql://user:pass@host:port/dbname?sslaccept=strict"`.

### 2. Required Prisma Commands

Generate the Prisma client:
```bash
npx prisma generate
```

Push schema directly to database (development or initial cloud setup):
```bash
npx prisma db push
```

Create migration files for production deployments:
```bash
npx prisma migrate dev --name init
```

Apply migrations on production servers:
```bash
npx prisma migrate deploy
```

Open Prisma Studio GUI (database browser):
```bash
npx prisma studio
```

Seed database with admin user and complete portfolio content:
```bash
node prisma/seed.js
```

---

## Running Locally

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Generate Prisma client & sync database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Seed initial data**:
   ```bash
   node prisma/seed.js
   ```

4. **Start the backend server**:
   - For development (with nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

5. **Run automated test suite**:
   ```bash
   npm test
   ```

---

## REST API Endpoints

### Health Check
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Checks server status and MySQL database connectivity |

### Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public (Rate Limited) | Admin login; returns JWT token (passwords never exposed) |
| `POST` | `/api/auth/logout` | Admin (JWT) | Clears session/token |
| `GET` | `/api/auth/me` | Admin (JWT) | Returns current authenticated admin profile |

### Profile CMS
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profile` | Public | Returns portfolio profile data |
| `PUT` | `/api/profile` | Admin (JWT) | Updates profile metadata |
| `POST` | `/api/profile/image` | Admin (JWT) | Uploads profile avatar photo |
| `DELETE` | `/api/profile/image` | Admin (JWT) | Deletes profile avatar photo |

### Hero & About CMS
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hero` | Public | Returns hero banner content |
| `PUT` | `/api/hero` | Admin (JWT) | Updates hero banner content |
| `GET` | `/api/about` | Public | Returns about me section |
| `PUT` | `/api/about` | Admin (JWT) | Updates about me section |

### Services CMS
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | Public | Lists active services (ordered) |
| `POST` | `/api/services` | Admin (JWT) | Creates new service |
| `GET` | `/api/services/:id` | Public | Returns service by ID |
| `PUT` | `/api/services/:id` | Admin (JWT) | Updates service |
| `DELETE` | `/api/services/:id` | Admin (JWT) | Deletes service |

### Skills CMS
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | Public | Lists skills (supports `?category=frontend`) |
| `POST` | `/api/skills` | Admin (JWT) | Creates skill |
| `GET` | `/api/skills/:id` | Public | Returns skill by ID |
| `PUT` | `/api/skills/:id` | Admin (JWT) | Updates skill |
| `DELETE` | `/api/skills/:id` | Admin (JWT) | Deletes skill |

### Projects CMS
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Public | Lists projects (supports `?page=1&limit=10`, `?featured=true`, `?search=query`) |
| `GET` | `/api/projects/:id` | Public | Returns project by ID with images |
| `GET` | `/api/projects/slug/:slug` | Public | Returns project by unique URL slug |
| `POST` | `/api/projects` | Admin (JWT) | Creates project (auto-generates unique slug) |
| `PUT` | `/api/projects/:id` | Admin (JWT) | Updates project details |
| `DELETE` | `/api/projects/:id` | Admin (JWT) | Deletes project and associated images |
| `POST` | `/api/projects/:id/images` | Admin (JWT) | Uploads or links project gallery image |
| `DELETE` | `/api/projects/:id/images/:imageId` | Admin (JWT) | Deletes project image |

### Experience & Education CMS
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/experience` | Public | Lists work experiences |
| `POST` | `/api/experience` | Admin (JWT) | Creates experience entry |
| `PUT` | `/api/experience/:id` | Admin (JWT) | Updates experience entry |
| `DELETE` | `/api/experience/:id` | Admin (JWT) | Deletes experience entry |
| `GET` | `/api/education` | Public | Lists education entries |
| `POST` | `/api/education` | Admin (JWT) | Creates education entry |
| `PUT` | `/api/education/:id` | Admin (JWT) | Updates education entry |
| `DELETE` | `/api/education/:id` | Admin (JWT) | Deletes education entry |

### Certifications & Achievements CMS
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/certifications` | Public | Lists certifications (paginated/filtered) |
| `POST` | `/api/certifications` | Admin (JWT) | Creates certification (supports PDF/JPG/PNG upload) |
| `PUT` | `/api/certifications/:id` | Admin (JWT) | Updates certification |
| `DELETE` | `/api/certifications/:id` | Admin (JWT) | Deletes certification and local file |
| `GET` | `/api/achievements` | Public | Lists achievements |
| `POST` | `/api/achievements` | Admin (JWT) | Creates achievement |
| `PUT` | `/api/achievements/:id` | Admin (JWT) | Updates achievement |
| `DELETE` | `/api/achievements/:id` | Admin (JWT) | Deletes achievement |

### Resume CMS & Binary PDF Download
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/resume` | Public | Returns active resume metadata |
| `GET` | `/api/resume/download` | Public | **Streams actual PDF binary** with `Content-Disposition: attachment; filename="Dhanush-M-Resume.pdf"` |
| `POST` | `/api/resume` | Admin (JWT) | Uploads new PDF resume in a transaction (deactivates prior active resume) |
| `PUT` | `/api/resume/:id` | Admin (JWT) | Updates resume metadata |
| `DELETE` | `/api/resume/:id` | Admin (JWT) | Deletes resume |

### Social Links, Navigation, Footer & Settings CMS
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/social-links` | Public | Lists active social links |
| `POST` | `/api/social-links` | Admin (JWT) | Creates social link |
| `PUT` | `/api/social-links/:id` | Admin (JWT) | Updates social link |
| `DELETE` | `/api/social-links/:id` | Admin (JWT) | Deletes social link |
| `GET` | `/api/navigation` | Public | Lists navigation menu items |
| `PUT` | `/api/navigation/:id` | Admin (JWT) | Updates navigation item |
| `GET` | `/api/footer` | Public | Returns footer content |
| `PUT` | `/api/footer` | Admin (JWT) | Updates footer content |
| `GET` | `/api/settings` | Public | Returns global site settings |
| `PUT` | `/api/settings` | Admin (JWT) | Updates website settings |

### Contact Inquiries System
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Public (Rate Limited) | Validated contact submission (whitelisted fields, spam limit) |
| `GET` | `/api/contact` | Admin (JWT) | Paginated list of messages (`?page=1&limit=20&isRead=false`) |
| `GET` | `/api/contact/:id` | Admin (JWT) | View single contact inquiry |
| `PATCH` | `/api/contact/:id/read` | Admin (JWT) | Marks message as read/unread |
| `DELETE` | `/api/contact/:id` | Admin (JWT) | Deletes message |

---

## Response Format Standards

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Validation Error (HTTP 422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Error Response (HTTP 400, 401, 403, 404, 409, 500)
```json
{
  "success": false,
  "message": "Record not found"
}
```

---

## Security Features

1. **Helmet**: Sets secure HTTP response headers (`X-Content-Type-Options`, `Strict-Transport-Security`, `X-Frame-Options`).
2. **Strict CORS**: Origin is matched against `FRONTEND_URL` in production; wildcard `*` is strictly disallowed in production.
3. **Rate Limiting**:
   - `apiLimiter`: 300 requests / 15 mins for general browsing.
   - `authLimiter`: 10 attempts / 15 mins to mitigate password brute-forcing.
   - `contactLimiter`: 5 submissions / 15 mins to prevent contact form spamming.
4. **JWT Authentication & bcrypt**:
   - Passwords hashed with 12 bcrypt salt rounds.
   - JWT tokens signed with expiration.
   - Controllers and serializers never leak password hashes or secrets in any response.
5. **Strict File Upload Validation**:
   - Resumes: Only MIME `application/pdf` and extension `.pdf` up to 10MB.
   - Certifications: PDF, JPG, JPEG, PNG up to 15MB.
   - Images: JPG, JPEG, PNG, WEBP up to 5MB.
   - Extension and MIME type both validated.
6. **Graceful Shutdown**: Listens for `SIGINT` and `SIGTERM` to safely terminate active connections and cleanly disconnect Prisma Client.

---

## Production Deployment Guide

### Deploying to Render / Railway
1. Push repository to GitHub.
2. In Railway/Render dashboard, create a **Node.js Web Service** with root directory set to `backend`.
3. Set Build Command:
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy
   ```
4. Set Start Command:
   ```bash
   npm start
   ```
5. Configure Environment Variables in the hosting dashboard:
   - `DATABASE_URL`: Cloud MySQL connection string
   - `JWT_SECRET`: 32+ character random string
   - `FRONTEND_URL`: Production React app domain (e.g. `https://dhanush-m.vercel.app`)
   - `NODE_ENV`: `production`
   - `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
6. Run initial seed via the service console:
   ```bash
   node prisma/seed.js
   ```

---

## Author
**Dhanush M**  
Full Stack Developer  
- **LinkedIn**: [https://www.linkedin.com/in/dhanush151005/](https://www.linkedin.com/in/dhanush151005/)  
- **GitHub**: [https://github.com/Dhanush-M-05](https://github.com/Dhanush-M-05)  
- **Email**: [dhanush2005mp@gmail.com](mailto:dhanush2005mp@gmail.com)
