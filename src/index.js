const path = require("path");
const express = require("express");
const app = express();
const port = 3004;

const configViewEngine = require("./config/viewEngine");
const configSession = require("./config/session");

const route = require("./routes");

configViewEngine(app);
configSession(app);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

route(app);

// Routes
route(app);

// Start server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
