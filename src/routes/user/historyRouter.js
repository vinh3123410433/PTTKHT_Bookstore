import express from "express";
import historyController from "../../app/controllers/user/historyController.js";

const router = express.Router();

// Sử dụng renderHistoryPage như một hàm callback
router.get("/", historyController.renderHistoryPage);

export default router;
