import express from "express";
import siteRouter from "./site.js";
import userRouter from "./userRouter.js";
import cartRouter from "./cartRouter.js";
import historyRouter from "./historyRouter.js";
import orderRouter from "./orderRouter.js";

// Controllers
import pdController from "../app/controllers/ProductsController.js";
import categoryController from "../app/controllers/CategoryController.js";
import siteController from "../app/controllers/SiteController.js";

const router = express.Router();

// Các route cho các phần của website
router.get("/products", pdController.index);
router.get("/category/:id?", categoryController.index);
router.use("/user", userRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/lichsudonhang", historyRouter);
router.get("/search", siteController.search);

// Đặt siteRouter cho trang chủ
router.use("/", siteRouter);

export default router;
