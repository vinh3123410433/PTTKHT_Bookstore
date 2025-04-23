// const express = require('express');
// const StatisticController = require('../controller/StatisticController');
import express from "express";
const router = express.Router();
import StatisticController from "../../app/controllers/warehouse/StatisticController.js";

router.get("/create_excel", StatisticController.create_excel);

router.get("/history", StatisticController.history);

router.get("/", StatisticController.index);

// module.exports = router;
export default router;
