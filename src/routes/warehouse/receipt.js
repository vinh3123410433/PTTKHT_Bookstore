// const express = require('express');
// const ReceiptController = require('../controller/ReceiptController');
import express from "express";
const router = express.Router();
import ReceiptController from "../../app/controllers/warehouse/ReceiptController.js";

router.get("/search_provider", ReceiptController.search_provider);

router.get("/search_employee", ReceiptController.search_employee);

router.get("/search_product", ReceiptController.search_product);

router.get("/view/:id", ReceiptController.view);

router.get("/create", ReceiptController.create);

router.post("/store", ReceiptController.store);

router.get("/update/:id", ReceiptController.update);

router.post("/edit", ReceiptController.edit);

router.get("/create_pdf/:id", ReceiptController.create_pdf);

router.get("/create_excel", ReceiptController.create_excel);

router.get("/", ReceiptController.index);

// module.exports = router;
export default router;
