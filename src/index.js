// src/index.js

import express from "express";
import route from "./routes/index.js";
import configViewEngine from "./config/viewEngine.js";
import configSession from "./config/session.js";

const app = express();
const port = 3000;

// Body parser
// Thêm dòng này để tăng giới hạn upload body
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

// Add response time monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log requests that take longer than 1000ms (1 second)
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.originalUrl} took ${duration}ms`);
    }
  });
  next();
});

// Add middleware to prevent headers already sent errors
app.use((req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;
  const originalRender = res.render;
  let sent = false;

  // Override res.send
  res.send = function(...args) {
    if (sent) {
      console.warn(`Attempting to send a response twice for ${req.method} ${req.originalUrl}`);
      console.trace("Response already sent, stack trace:");
      return this;
    }
    sent = true;
    return originalSend.apply(this, args);
  };

  // Override res.json
  res.json = function(...args) {
    if (sent) {
      console.warn(`Attempting to send a JSON response twice for ${req.method} ${req.originalUrl}`);
      console.trace("Response already sent, stack trace:");
      return this;
    }
    sent = true;
    return originalJson.apply(this, args);
  };

  // Override res.render
  res.render = function(...args) {
    if (sent) {
      console.warn(`Attempting to render a response twice for ${req.method} ${req.originalUrl}`);
      console.trace("Response already sent, stack trace:");
      return this;
    }
    sent = true;
    return originalRender.apply(this, args);
  };

  next();
});

// Session, ViewEngine, Static
configSession(app);
configViewEngine(app);

// Routes
route(app);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { layout: false });
});

// Improved error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Determine if the request is coming from the admin area
  const isAdminRequest = req.originalUrl.startsWith('/admin');
  
  // Return appropriate error response based on request type
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    // Return JSON error for AJAX requests
    res.status(500).json({
      error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
    });
  } else if (isAdminRequest) {
    // Use admin layout for admin errors
    res.status(500).render("errors/500", {
      layout: "admin",
      error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
    });
  } else {
    // Use default layout for regular site errors
    res.status(500).render("500", {
      error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
    });
  }
});

// Add graceful shutdown for database connections
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  // Close database connections, etc if needed
  process.exit(0);
}

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
