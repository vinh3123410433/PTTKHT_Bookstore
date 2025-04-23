// const express = require('express');
// const DashboardController = require('../controller/DashboardController');
import express from "express";
const router = express.Router();
import DashboardController from "../../app/controllers/warehouse/DashboardController.js";

router.get("/", DashboardController.index);

// module.exports = router;
export default router;
