import express from "express";
import orderController from "../../app/controllers/sales/OrderController.js";

const router = express.Router();

router.get("/show", orderController.show);
router.get("/export-excel", orderController.exportOrdersExcel);
router.get("/:id/exportPdf", orderController.exportOrderPdf);
router.post("/:id/confirmPayment", orderController.updatePaymentStatus);
router.post("/:id/confirmReturnRequest", orderController.updatePaymentStatus);
router.post("/:id/confirm", orderController.updateStatus);
router.post("/:id/cancel", orderController.updateStatus);
router.post("/:id/archive", orderController.updateArchive);
router.post("/:id/unarchive", orderController.updateArchive);
router.get("/:id", orderController.showById);
export default router;
