import { Router } from "express";
import { PurchaseController } from "../controller/PruchaseController";

const router = Router();

router.post("/create-purchase-order", PurchaseController.createPurchase );
router.get("/orders", PurchaseController.getOrdersByIdStore);
router.get("/purchase-order", PurchaseController.getOrdersByIdComprador);
router.get("/order", PurchaseController.getOrder);
router.post("/update-order", PurchaseController.updateOrder);


export default router;