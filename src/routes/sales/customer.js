import express from "express";
import CustomerController from "../../app/controllers/sales/CustomerController.js";

const router = express.Router();

// List all customers
router.get("/", CustomerController.index);

// View customer details
router.get("/view/:id", CustomerController.showDetails);

// Create new customer form
router.get("/create", CustomerController.showCreate);
router.post("/create", CustomerController.create);

// Edit customer
router.get("/edit/:id", CustomerController.showEdit);
router.post("/edit/:id", CustomerController.update);

// Delete customer
router.post("/delete/:id", CustomerController.delete);

export default router;