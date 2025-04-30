import orderRouter from "./orders.js"; // Corrected import path
import DashboardController from "../controllers/DashboardController.js";
import statisticRouter from "./statistic.js"; // Corrected import path

function route(app) {
  app.use("/orders", orderRouter);
  app.use("/statistic", statisticRouter); // Corrected import path
  app.get("/", DashboardController.show);
}

export default route;
