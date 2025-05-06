import express from "express";
import CustomerController from "../../app/controllers/sales/CustomerController.js";
import { isLoggedIn, checkPermission } from "../../app/middlewares/admin/auth.js";

const router = express.Router();

// List all customers
router.get("/", CustomerController.index);

// Show create customer form
router.get("/create", CustomerController.showCreate);

// Handle create customer
router.post("/create", CustomerController.create);

// Show customer details
router.get("/details/:id", CustomerController.showDetails);

// Show edit customer form
router.get("/edit/:id", CustomerController.showEdit);

// Handle update customer
router.post("/edit/:id", CustomerController.update);

// Handle delete customer
router.post("/delete/:id", CustomerController.delete);

export default router;