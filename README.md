# 🔗 URL Shortener API

A high-performance URL shortener backend built with Express.js, PostgreSQL, and Redis caching.

## ✨ Features

- **URL Shortening** - Generate short, unique codes for long URLs
- **Fast Redirects** - Redis caching for lightning-fast URL lookups
- **User Authentication** - JWT-based auth with secure password hashing
- **CRUD Operations** - Full control over your shortened URLs
- **PostgreSQL** - Reliable data persistence with Drizzle ORM

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Express.js | Web framework |
| PostgreSQL | Database |
| Redis | Caching |
| Drizzle ORM | Database ORM |
| JWT | Authentication |
| Docker | Containerization |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd URL_shortner/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Docker services**
   ```bash
   docker-compose up -d
   ```

4. **Configure environment variables**
   
   Create a `.env` file:
   ```env
   PORT=3000
   DATABASE_URL=postgres://user:pass@localhost:5432/url_shortener
   JWT_SECRET=your_jwt_secret
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis_pass_123
   ```

5. **Run database migrations**
   ```bash
   npx drizzle-kit push
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT token |

### URL Management (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/url` | Create shortened URL |
| `GET` | `/api/urls` | Get all your URLs |
| `GET` | `/api/url/:id` | Get URL by ID |
| `PUT` | `/api/url/:id` | Update URL |
| `DELETE` | `/api/url/:id` | Delete URL |

### Redirect

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/:shortCode` | Redirect to original URL |

## 🐳 Docker Services

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

**Services:**
- PostgreSQL on port `5432`
- Redis on port `6379`

## 📁 Project Structure

```
server/
├── src/
│   ├── db/
│   │   └── schema.ts       # Database models
│   ├── modules/
│   │   ├── auth/           # Authentication
│   │   ├── url/            # URL CRUD operations
│   │   └── re-direct/      # URL redirection
│   ├── app.ts              # Express app setup
│   └── index.ts            # Entry point
├── docker-compose.yml
├── drizzle.config.ts
└── package.json
```

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |

## 📄 License

ISC
