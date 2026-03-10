import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./modules/auth/routes";
import urlRoutes from "./modules/url/routes";
import redirectRoutes from "./modules/re-direct/routes";
import { authMiddleware } from "./modules/auth/middleware";
import analyticsRoutes from "./modules/analytics/routes";
import { startAnalyticsWorker } from "./modules/analytics/sync";
import { document } from "./lib/openapi";


const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
startAnalyticsWorker(30);

app.get("/", (_req, res) => {
    res.send("Hello World!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(document));
app.get("/swagger.json", (_req, res) => {
    res.json(document);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", authMiddleware, urlRoutes);
app.use("/", redirectRoutes);
app.use("/api", authMiddleware, analyticsRoutes);

export default app;
