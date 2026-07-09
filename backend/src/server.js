import client from "prom-client";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import githubRoutes from './routes/github.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Prometheus Metrics
const register = new client.Registry();

client.collectDefaultMetrics({
  register,
});

const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP Requests",
});

register.registerMetric(httpRequests);
// Middleware
app.use(express.json());
app.use(cors({
  origin: '*'
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // limit each IP to 60 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});
app.use('/api', limiter);

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "GitHub Persona Backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use('/api/github', githubRoutes);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
