import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import hbs from "express-handlebars";
import moment from "moment";

// Thiết lập __filename và __dirname cho ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configViewEngine = (app) => {
  // Serve static files trước
  app.use(express.static(path.join(__dirname, "../public")));

  // Đăng ký Handlebars engine với helpers
  app.engine(
    "hbs",
    hbs.engine({
      extname: ".hbs",
      layoutsDir: path.join(__dirname, "../resources/views/layouts"),
      partialsDir: path.join(__dirname, "../resources/views/partials"),
      defaultLayout: "main",
      helpers: {
        formatNumber: (number) =>
          number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        formatCurrency: (value) =>
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value),
        formatDate: (timestamp, fmt) => moment(timestamp).format(fmt),
        inc: (value) => parseInt(value, 10) + 1,
        add: (a, b) => Number(a) + Number(b),
        subtract: (a, b) => Number(a) - Number(b),
        eq: (a, b) => a == b,
        or: (a, b) => a || b,
        isChecked: (id, list) =>
          Array.isArray(list) && list.some((cat) => cat.DanhMucID == id)
            ? "checked"
            : "",
        range: (start, end, opts) => {
          if (opts && typeof opts.fn === "function") {
            let res = "";
            for (let i = start; i <= end; i++) res += opts.fn(i);
            return res;
          }
          let arr = [];
          for (let i = start; i <= end; i++) arr.push(i);
          return arr;
        },
        paginationURL: (page, opts) =>
          `?${new URLSearchParams({
            ...opts.data.root.query,
            page,
          }).toString()}`,
        includes: (arr, val) => {
          const a = Array.isArray(arr) ? arr : [arr];
          return a.includes(val.toString()) || a.includes(Number(val));
        },
        block: function (name, opts) {
          this._blocks = this._blocks || {};
          this._blocks[name] = opts.fn(this);
          return null;
        },
      },
    })
  );

  // Set views folder và view engine
  app.set("views", path.join(__dirname, "../resources/views"));
  app.set("view engine", "hbs");
};

export default configViewEngine;
