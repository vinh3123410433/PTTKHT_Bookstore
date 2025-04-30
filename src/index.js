// src/index.js

import express from "express";
import route from "./routes/index.js";
import configViewEngine from "./config/viewEngine.js";
import configSession from "./config/session.js";

const app = express();
const port = 5000;

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session, ViewEngine, Static
configSession(app);
configViewEngine(app);

// Routes
route(app);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // In ra console
  res.status(500).render("500", { error: err });
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
