import express from "express";
import dashboardController from "../controllers/DashboardController.js";

const router = express.Router();

router.get("/", dashboardController.show);
