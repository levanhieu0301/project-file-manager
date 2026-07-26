import { Router } from "express";
const router = Router();
import * as uploadController from "../controllers/file-manager.controller"
import multer from "multer";
const upload = multer();

router.post('/upload',upload.array("files"), uploadController.upload)
router.patch('/change-file-name',upload.none(), uploadController.changeFileName)

export default router;