import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes";
import urlRoutes from "./modules/url/routes";
import redirectRoutes from "./modules/re-direct/routes";
import { authMiddleware } from "./modules/auth/middleware";
import analyticsRoutes from "./modules/analytics/routes";
import { startAnalyticsWorker } from "./modules/analytics/snyc";


const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
startAnalyticsWorker(1);

app.get("/", (_req, res) => {
    res.send("Hello World!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", authMiddleware, urlRoutes);
app.use("/", redirectRoutes);
app.use("/api", authMiddleware, analyticsRoutes);

export default app;
