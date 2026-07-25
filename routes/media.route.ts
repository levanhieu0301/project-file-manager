import { Router } from "express";
const router = Router();
import * as mediaController from "../controllers/media.controller"
import multer from "multer";
const upload = multer();

router.get('/:filename', mediaController.getFile)

export default router;