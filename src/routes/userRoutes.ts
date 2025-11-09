import { Router } from "express";
import { UserController } from "../controller/UserCotroller";

const router = Router();

router.post("/create-user", UserController.createUser);
router.get("/user", UserController.getUser);
router.post("/update-user", UserController.updateUser);

export default router;