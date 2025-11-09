import { Router } from "express";
import { ProductController } from "../controller/ProductController";
import { upload } from "../middlewares/uploadImage";

const router = Router();

router.post("/create-product", upload.single("image"), ProductController.createProduct);
router.get("/products", ProductController.getProducts);
router.get("/product", ProductController.getProduct);
router.post("/update-product", ProductController.updateProduct);

export default router;