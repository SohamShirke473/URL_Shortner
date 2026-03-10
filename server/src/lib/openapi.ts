export const document = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "URL Shortener API",
    description: "API for shortening URLs with analytics",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  name: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
          },
          "400": {
            description: "Validation failed or user already exists",
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
          },
          "400": {
            description: "Invalid credentials",
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User profile retrieved",
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/url": {
      post: {
        tags: ["URLs"],
        summary: "Shorten a URL",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "URL created successfully",
          },
          "400": {
            description: "Validation failed",
          },
        },
      },
    },
    "/api/urls": {
      get: {
        tags: ["URLs"],
        summary: "Get all URLs for current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "URLs retrieved successfully",
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/url/{id}": {
      get: {
        tags: ["URLs"],
        summary: "Get URL by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "URL retrieved successfully",
          },
          "404": {
            description: "URL not found",
          },
        },
      },
      put: {
        tags: ["URLs"],
        summary: "Update URL",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "URL updated successfully",
          },
          "404": {
            description: "URL not found",
          },
        },
      },
      delete: {
        tags: ["URLs"],
        summary: "Delete URL",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "URL deleted successfully",
          },
          "404": {
            description: "URL not found",
          },
        },
      },
    },
    "/api/urls/bulk": {
      delete: {
        tags: ["URLs"],
        summary: "Bulk delete URLs",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ids"],
                properties: {
                  ids: { type: "array", items: { type: "string", format: "uuid" } },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "URLs deleted successfully",
          },
        },
      },
    },
    "/api/analytics/{id}": {
      get: {
        tags: ["Analytics"],
        summary: "Get analytics for a URL",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Analytics retrieved successfully",
          },
          "404": {
            description: "No analytics found",
          },
        },
      },
    },
    "/api/analytics": {
      get: {
        tags: ["Analytics"],
        summary: "Get all analytics for user's URLs",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Analytics retrieved successfully",
          },
          "404": {
            description: "No analytics found",
          },
        },
      },
    },
    "/{shortCode}": {
      get: {
        tags: ["Redirect"],
        summary: "Redirect short URL to original URL",
        parameters: [
          {
            name: "shortCode",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "302": {
            description: "Redirect to original URL",
          },
          "404": {
            description: "Short URL not found",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
