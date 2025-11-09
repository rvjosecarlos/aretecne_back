import { Router } from "express";
import { CampaignController } from "../controller/CampaignController";
import { upload } from "../middlewares/uploadImage";

const router = Router();

router.post("/create-campaign", upload.single("image"), CampaignController.createCampaign);
router.get("/campaigns", CampaignController.getCampaigns);
router.get("/campaign", CampaignController.getCampaignById);
router.get("/campaigns-autor", CampaignController.getCampaignByAutor);
router.post("/update-campaign", CampaignController.updateCampaign);
router.post("/donate", CampaignController.donateCampaign);
router.post("/complete-donate", CampaignController.completeDonate);

export default router;