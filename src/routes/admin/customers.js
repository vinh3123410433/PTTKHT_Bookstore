import express from "express";
import CustomerController from "../../app/controllers/admin/CustomerController.js";
import { isLoggedIn, checkPermission } from "../../app/middlewares/admin/auth.js";

const router = express.Router();

// Customer routes - ensuring users with admin, qldoanhnghiep, khachhang, or qlbanhang can access
router.get("/", isLoggedIn, checkPermission(["admin", "qldoanhnghiep", "khachhang", "qlbanhang"]), CustomerController.index);
router.get("/create", isLoggedIn, checkPermission(["admin", "qldoanhnghiep", "khachhang", "qlbanhang"]), CustomerController.showCreate);
router.post("/create", isLoggedIn, checkPermission(["admin", "qldoanhnghiep", "khachhang", "qlbanhang"]), CustomerController.create);
router.get("/edit/:id", isLoggedIn, checkPermission(["admin", "qldoanhnghiep", "khachhang", "qlbanhang"]), CustomerController.showEdit);
router.post("/edit/:id", isLoggedIn, checkPermission(["admin", "qldoanhnghiep", "khachhang", "qlbanhang"]), CustomerController.update);
router.get("/delete/:id", isLoggedIn, checkPermission(["admin", "qldoanhnghiep", "khachhang", "qlbanhang"]), CustomerController.delete);
router.get("/details/:id", isLoggedIn, checkPermission(["admin", "qldoanhnghiep", "khachhang", "qlbanhang"]), CustomerController.showDetails);

export default router;