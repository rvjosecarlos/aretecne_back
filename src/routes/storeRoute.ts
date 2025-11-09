import { Router } from "express";
import { StoreController } from "../controller/StoreController";

const router = Router();

router.post("/create-store", StoreController.createStore);
router.get("/store", StoreController.getStore);
router.get("/stores", StoreController.getStores);
router.post("/update-store", StoreController.updateStore);

export default router;