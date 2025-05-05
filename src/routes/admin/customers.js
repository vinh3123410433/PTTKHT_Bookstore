import express from "express";
import CustomerController from "../../app/controllers/admin/CustomerController.js";
import { isLoggedIn, checkPermission } from "../../app/middlewares/admin/auth.js";

const router = express.Router();

// Customer routes
router.get("/", CustomerController.index);
router.get("/create", CustomerController.showCreate);
router.post("/create", CustomerController.create);
router.get("/edit/:id", CustomerController.showEdit);
router.post("/edit/:id", CustomerController.update);
router.get("/delete/:id", CustomerController.delete);
router.get("/details/:id", CustomerController.showDetails);

export default router;