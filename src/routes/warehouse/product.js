// const express = require('express');
// const ProductController = require('../controller/ProductController');
import express from "express";
const router = express.Router();
import ProductController from "../../app/controllers/warehouse/ProductController.js";

router.get("/search", ProductController.search);

router.get("/view/:id", ProductController.view);

router.get("/create", ProductController.create);

router.get("/create_excel", ProductController.create_excel);

router.post("/store", ProductController.store);

router.get("/update/:id", ProductController.update);

router.post("/edit", ProductController.edit);

router.get("/delete/:id", ProductController.delete);

router.get("/delete_opt", ProductController.delete_opt);

router.get("/on_sale", ProductController.on_sale);

router.get("/", ProductController.index);

// module.exports = router;
export default router;
