# API Routes Documentation

## Base URL
```
http://localhost:<PORT>
```

---

## 🔓 Public Routes

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Returns "Hello World!" - Server health check |

### Redirect
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/:shortCode` | Redirects to the original URL based on short code |

---

## 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get authentication token |

---

## 🔗 URL Routes (`/api`) - *Protected*

> ⚠️ **Note:** All URL routes require authentication via `authMiddleware`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/url` | Create a new shortened URL |
| `GET` | `/api/urls` | Get all shortened URLs |
| `GET` | `/api/url/:id` | Get a specific URL by ID |
| `PUT` | `/api/url/:id` | Update a shortened URL by ID |
| `DELETE` | `/api/url/:id` | Delete a shortened URL by ID |

---

## Route Summary

| Module | Base Path | Auth Required |
|--------|-----------|---------------|
| Health | `/` | ❌ |
| Redirect | `/` | ❌ |
| Auth | `/api/auth` | ❌ |
| URL | `/api` | ✅ |
