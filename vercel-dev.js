// vercel-dev.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const FRONTEND_PORT = 5173;
const BACKEND_PORT = 7788; // Changed to match your running backend port

// CORS for development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,OPTIONS,PATCH"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Log all requests
app.use((req, res, next) => {
  console.log(`[PROXY] ${req.method} ${req.url}`);
  next();
});

// Proxy /api requests to backend
app.use(
  "/api",
  createProxyMiddleware({
    target: `http://localhost:${BACKEND_PORT}`,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      console.log(`[PROXY] Forwarding to backend: ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error("[PROXY] Backend proxy error:", err);
      res.status(500).json({ error: "Backend proxy error" });
    },
  })
);

// Frontend requests
app.use(
  "/",
  createProxyMiddleware({
    target: `http://localhost:${FRONTEND_PORT}`,
    changeOrigin: true,
    ws: true,
    onProxyReq: (proxyReq, req) => {
      console.log(`[PROXY] Forwarding to frontend: ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error("[PROXY] Frontend proxy error:", err);
      res.status(500).json({ error: "Frontend proxy error" });
    },
  })
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log("\n=== Development Environment ===");
  console.log(`Main URL: http://localhost:${PORT}`);
  console.log(`Frontend (Vite): http://localhost:${FRONTEND_PORT}`);
  console.log(`Backend: http://localhost:${BACKEND_PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log("===============================\n");
});
