const siteRouter = require("./site");
const productsRouter = require("./products");
const categoryRouter = require("./category");
const homeRouter = require("./homeRouter");
const userRouter = require("./userRouter");
const cartRouter = require("./cartRouter");

function route(app) {
  console.log("Routing initialized...");

  app.use("/products", productsRouter);
  app.use("/category", categoryRouter);
  app.use("/user", userRouter);
  app.use("/cart", cartRouter);

  // Nếu homeRouter chỉ xử lý trang chủ "/", nên đặt trước siteRouter
  app.use("/", homeRouter);
  app.use("/", siteRouter);
}

module.exports = route;
