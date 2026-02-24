/**
 * Express Application Setup
 * Main entry point for the House FinMan API
 */

import "dotenv/config"
import express, { Application } from "express"
import helmet from "helmet"
import cors from "cors"
import compression from "compression"
import cookieParser from "cookie-parser"
import path from "path"

import { createServer } from "http"
import { config } from "./config/index.js"
import { connectDatabase } from "./models/prisma.js"
import { logger } from "./utils/logger.js"
import { socketService } from "./services/socketService.js"
import { jobScheduler } from "./services/jobScheduler.js"
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
  defaultLimiter,
  gatewayHandler,
} from "./middlewares/index.js"

// Routes
import {
  authRoutes,
  leadRoutes,
  userRoutes,
  dashboardRoutes,
  analyticsRoutes,
  opportunitiesRouter,
  partnersRouter,
  vendorsRouter,
  propertiesRouter,
  ticketsRouter,
  campaignsRouter,
  loanRoutes,
  surveyRoutes,
} from "./routes/index.js"

const app: Application = express()

// ===========================================
// Security Middleware
// ===========================================

// Helmet - Security headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         scriptSrc: ["'self'"],
//         imgSrc: ["'self'", "data:", "https:"],
//         connectSrc: ["'self'"],
//         fontSrc: ["'self'", "https://fonts.gstatic.com"],
//         objectSrc: ["'none'"],
//         mediaSrc: ["'self'"],
//         frameSrc: ["'none'"],
//       },
//     },
//     crossOriginEmbedderPolicy: false,
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//     hsts: {
//       maxAge: 31536000,
//       includeSubDomains: true,
//       preload: true,
//     },
//   }),
// )
app.use(
  helmet({
    contentSecurityPolicy: false, // disable for now
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    hsts: false, // 🔴 THIS IS IMPORTANT
  }),
)

// Permissions Policy (FKA Feature Policy)
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), vr=()",
  )
  next()
})

// CORS
app.use(
  cors({
    origin: config.corsOrigin.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  }),
)

// Compression
app.use(compression())

// Body parsing with size limits
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))

// Cookie parsing
app.use(cookieParser())

// Request logging
app.use(requestLogger)

// API Gateway (Correlation ID, Context, Content-Type)
app.use(gatewayHandler)

// Rate limiting (global)
app.use(defaultLimiter)

// ===========================================
// Health Check
// ===========================================

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  })
})

// ===========================================
// API Routes
// ===========================================

const apiPrefix = config.apiPrefix

// Auth (public)
app.use(`${apiPrefix}/auth`, authRoutes)

// Protected routes
app.use(`${apiPrefix}/users`, userRoutes)
app.use(`${apiPrefix}/leads`, leadRoutes)
app.use(`${apiPrefix}/opportunities`, opportunitiesRouter)
app.use(`${apiPrefix}/partners`, partnersRouter)
app.use(`${apiPrefix}/vendors`, vendorsRouter)
app.use(`${apiPrefix}/properties`, propertiesRouter)
app.use(`${apiPrefix}/tickets`, ticketsRouter)
app.use(`${apiPrefix}/campaigns`, campaignsRouter)
app.use(`${apiPrefix}/loans`, loanRoutes)
app.use(`${apiPrefix}/surveys`, surveyRoutes)
app.use(`${apiPrefix}/dashboard`, dashboardRoutes)
app.use(`${apiPrefix}/analytics`, analyticsRoutes)

// ===========================================
// Frontend (Serve React/Vite Build)
// ===========================================

const __dirname = path.resolve()

app.use(express.static(path.join(__dirname, "dist_frontend")))

// SPA fallback (for React Router)
app.get("*", (req, res, next) => {
  if (req.path.startsWith(config.apiPrefix)) {
    return next() // Don't hijack API routes
  }

  res.sendFile(path.join(__dirname, "dist_frontend", "index.html"))
})

// ===========================================
// Error Handling
// ===========================================

// 404 handler
app.use(notFoundHandler)

// Global error handler (must be last)
app.use(errorHandler)

// ===========================================
// Server Startup
// ===========================================

async function startServer() {
  try {
    // Connect to database
    await connectDatabase()

    // Create HTTP server
    const httpServer = createServer(app)

    // buffer socket.io init
    socketService.init(httpServer)

    // Job Scheduler init
    jobScheduler.init()

    // Start server
    httpServer.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`)
      logger.info(`📚 API: http://localhost:${config.port}${config.apiPrefix}`)
      logger.info(`⚡️ WebSocket: ws://localhost:${config.port}`)
      logger.info(`🏥 Health: http://localhost:${config.port}/health`)
      logger.info(`🌍 Environment: ${config.nodeEnv}`)
    })
  } catch (error) {
    logger.error("Failed to start server", error as Error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully")
  process.exit(0)
})

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", error)
  process.exit(1)
})

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", reason as Error)
  process.exit(1)
})

startServer()

export default app
