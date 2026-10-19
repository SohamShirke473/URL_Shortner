# 🔗 Modern Full-Stack URL Shortener & Analytics Platform

A high-performance, full-stack URL shortener application built with **React 19**, **Express 5**, **PostgreSQL (Drizzle ORM)**, and **Redis** for sub-millisecond redirects and real-time click analytics.

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## ✨ Features

- **⚡ Instant URL Shortening**: Generate compact, collision-resistant unique short links powered by `nanoid`.
- **🏎️ Ultra-Fast Redirects**: Redis-cached lookups deliver sub-millisecond redirection times.
- **📊 Detailed Click Analytics**: Track total visits, unique clicks, referrers, devices, operating systems, and interactive timeline graphs powered by **Recharts**.
- **🔄 Smart Analytics Sync**: Background worker buffers click events in Redis and asynchronously syncs batch metrics to PostgreSQL without blocking redirect traffic.
- **🔐 Secure Authentication**: JWT-based session tokens with `bcrypt` password hashing and protected API routes.
- **🎨 Sleek, Responsive UI**: Modern dashboard built with Tailwind CSS v4, Lucide icons, Dark/Light theme switching, and quick copy-to-clipboard interactions.
- **📖 Interactive API Docs**: Auto-generated OpenAPI / Swagger documentation accessible directly at `/api-docs`.
- **🐳 One-Command Containerization**: Docker Compose configuration orchestrating Postgres, Redis, backend API, and Nginx-powered frontend.
- **☁️ Production Blueprint Ready**: Native `render.yaml` specification for zero-friction cloud deployment.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
| Technology | Description |
|------------|-------------|
| **React 19** | Modern UI library with concurrent features |
| **TypeScript** | Type-safe development |
| **Vite** | Fast development server and production bundler |
| **Tailwind CSS v4** | Next-generation utility-first styling engine |
| **TanStack React Query** | Server state synchronization, caching, and mutations |
| **Recharts** | Interactive charts for link performance and click metrics |
| **Lucide React** | Clean and consistent icon set |
| **Nginx** | High-performance static asset server in Docker |

### Backend (`server/`)
| Technology | Description |
|------------|-------------|
| **Express 5** | Node.js web application framework |
| **PostgreSQL 16** | Relational database for persistent storage |
| **Drizzle ORM** | Lightweight, type-safe SQL ORM and schema migration toolkit |
| **Redis 7** | In-memory key-value store for redirects cache and click buffering |
| **Zod** | Schema declaration and strict request validation |
| **Swagger / OpenAPI** | Interactive API testing interface (`/api-docs`) |
| **Bcrypt & JWT** | Password hashing and stateless authentication |

---

## 📁 Repository Structure

```
URL_Shortner-main/
├── client/                     # Frontend React (Vite) application
│   ├── src/
│   │   ├── components/         # Reusable UI & layout components
│   │   ├── pages/              # Landing, Dashboard, Analytics, Login, Register
│   │   ├── lib/                # API client, utilities, and query hooks
│   │   ├── App.tsx             # Route definitions and application shell
│   │   └── main.tsx            # Application entry point
│   ├── Dockerfile              # Multi-stage build with Nginx
│   ├── nginx.conf              # Production Nginx reverse-proxy / SPA rewrite
│   └── package.json
│
├── server/                     # Backend Express API
│   ├── src/
│   │   ├── db/                 # Drizzle database schemas and connection pool
│   │   ├── lib/                # OpenAPI schemas, validation helpers, redis client
│   │   ├── modules/
│   │   │   ├── auth/           # User registration, login, and JWT middleware
│   │   │   ├── url/            # URL CRUD operations
│   │   │   ├── re-direct/      # High-speed cached URL redirection
│   │   │   └── analytics/      # Click tracking & asynchronous sync worker
│   │   ├── app.ts              # Express application configuration
│   │   └── index.ts            # Server entry point
│   ├── drizzle/                # SQL migrations
│   ├── Dockerfile              # Production Node.js container build
│   └── package.json
│
├── .env.example                # Unified environment variables template
├── docker-compose.yml          # Full-stack orchestrator (Postgres, Redis, Server, Client)
├── render.yaml                 # Infrastructure-as-code blueprint for Render.com
└── README.md
```

---

## 🚀 Quickstart with Docker Compose

The fastest way to spin up the entire application (Database, Cache, API, and Frontend) is using Docker Compose:

### 1. Clone & Configure Environment

```bash
git clone <repository-url>
cd URL_Shortner-main
cp .env.example .env
```

### 2. Launch All Services

```bash
docker-compose up --build -d
```

### 3. Access Services

- 🌐 **Frontend App**: [http://localhost:3000](http://localhost:3000)
- 🚀 **Backend API**: [http://localhost:5000](http://localhost:5000)
- 📚 **Swagger API Docs**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

To stop services:
```bash
docker-compose down
```

---

## 💻 Manual Local Development Setup

If you prefer to run client and server independently for development:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or v20+)
- [Docker](https://www.docker.com/) (to run PostgreSQL & Redis easily)
- npm or yarn

---

### Step 1: Start PostgreSQL & Redis

Run Postgres and Redis via Docker, or use your local installations:

```bash
# Start standalone Postgres and Redis
docker run -d --name url-postgres -p 5432:5432 -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=url_shortener postgres:16
docker run -d --name url-redis -p 6379:6379 redis:7 redis-server --requirepass redis_pass_123
```

---

### Step 2: Configure Backend (`server/`)

1. Change into the server directory:
  ```bash
  cd server
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Create a `.env` file in `server/.env`:
  ```env
  PORT=5000
  DATABASE_URL=postgresql://user:pass@localhost:5432/url_shortener
  REDIS_HOST=localhost
  REDIS_PORT=6379
  REDIS_PASSWORD=redis_pass_123
  JWT_SECRET=super_secret_jwt_key_here
  FRONTEND_URL=http://localhost:5173
  ```

4. Push the database schema:
  ```bash
  npx drizzle-kit push
  ```

5. Start the backend development server:
  ```bash
  npm run dev
  ```
  *The backend will start at `http://localhost:5000`.*

---

### Step 3: Configure Frontend (`client/`)

1. In a new terminal window, navigate to the client folder:
  ```bash
  cd client
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. (Optional) Create a `.env` file in `client/.env`:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  VITE_SHORT_URL_BASE=http://localhost:5000
  ```

4. Start the frontend development server:
  ```bash
  npm run dev
  ```
  *The frontend will typically run at `http://localhost:5173`.*

---

## 📡 API Reference

Interactive OpenAPI / Swagger documentation is available at:
👉 **`http://localhost:5000/api-docs`** (or `GET /swagger.json` for raw schema)

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ |

### 🔗 URL Management (`/api`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `POST` | `/api/url` | Create a shortened URL | ✅ |
| `GET` | `/api/urls` | Retrieve all user URLs | ✅ |
| `GET` | `/api/url/:id` | Get details for a specific URL | ✅ |
| `PUT` | `/api/url/:id` | Update destination of a URL | ✅ |
| `DELETE`| `/api/url/:id` | Delete a shortened URL | ✅ |

### 📊 Analytics (`/api`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `GET` | `/api/analytics` | Get aggregated analytics for all URLs | ✅ |
| `GET` | `/api/analytics/:id` | Get click analytics & timeseries for a URL | ✅ |
| `POST` | `/api/analytics/sync` | Manually trigger sync from Redis buffer to DB | ❌ |

### ⚡ Redirection & Health
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `GET` | `/:shortCode` | Redirect to original URL (with click tracking) | ❌ |
| `GET` | `/` | Health check endpoint | ❌ |

---

## ☁️ Deployment

### Deploying to Render via Blueprint

This repository includes a [`render.yaml`](render.yaml) blueprint configuring:
1. **Managed PostgreSQL Database**
2. **Managed Redis Instance**
3. **Backend Web Service** (Node.js runtime)
4. **Frontend Static Site** (Vite SPA with rewrite rules)

To deploy:
1. Push this repository to GitHub or GitLab.
2. In the [Render Dashboard](https://dashboard.render.com/), choose **New +** → **Blueprint**.
3. Connect your repository — Render will automatically detect `render.yaml` and provision all services.

---

## 📜 Available Scripts

### Backend (`server/`)
- `npm run dev`: Runs server with hot reloading via `tsx watch`.
- `npm run build`: Compiles TypeScript to `dist/`.
- `npm start`: Runs production build with Node.js.

### Frontend (`client/`)
- `npm run dev`: Launches Vite development server.
- `npm run build`: Type-checks and builds production static bundle.
- `npm run preview`: Locally previews production build.
- `npm run lint`: Runs ESLint checks.
- `npm run format`: Formats TypeScript and TSX files with Prettier.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
