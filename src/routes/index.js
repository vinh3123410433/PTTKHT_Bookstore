// routes/index.js
import userRouters from "./userRouters.js"; // Cập nhật đường dẫn chính xác
import adminRouters from "./adminRouters.js"; // Cập nhật đường dẫn chính xác

const route = (app) => {
  app.use("/admin", adminRouters);
  app.use("/", userRouters);
};

export default route;
