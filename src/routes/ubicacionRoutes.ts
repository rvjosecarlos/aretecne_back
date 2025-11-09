import { Router } from "express";
import { UbicacionController } from "../controller/UbicacionController";

const router =  Router();

router.post("/create-ubicacion", UbicacionController.createUbicacion);
router.get("/ubicacion", UbicacionController.getUbicacion);
router.post("/update-ubicacion", UbicacionController.updateUbicacion);
router.post("/ubicaciones-cercanas", UbicacionController.getUbicaciones3Km);

export default router;