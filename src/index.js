const path = require("path");
const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const port = 3000; // Gộp về 1 cổng chính

// Cấu hình và routes
const configViewEngine = require("./config/viewEngine");
const configSession = require("./config/session");
const route = require("./routes");

// Cấu hình view engine (Handlebars)
app.engine(
  "hbs",
  hbs.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "resources/views/layouts"),
    partialsDir: path.join(__dirname, "resources/views/partials"),
    defaultLayout: "main",
    helpers: {
      formatNumber: (number) => {
        const num = Number(number);
        if (isNaN(num)) return "";
        return num.toLocaleString("vi-VN") + "₫";
      },
      eq: (a, b) => a === b,
      subtract: (a, b) => a - b,
      add: (a, b) => a + b,
      range: (start, end, options) => {
        let result = "";
        for (let i = start; i <= end; i++) {
          result += options.fn ? options.fn(i) : i;
        }
        return result;
      },
      paginationURL: (page, options) => {
        const query = { ...options.data.root.query, page };
        const params = new URLSearchParams(query);
        return `?${params.toString()}`;
      },
      includes: (array, value) => {
        if (!Array.isArray(array)) {
          array = [array];
        }
        return (
          array.includes(value.toString()) || array.includes(Number(value))
        );
      },
      or: (a, b) => a || b,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session và View Engine Config
configViewEngine(app);
configSession(app);

// Routes
route(app);

// Start server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
