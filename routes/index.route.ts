import { Router } from "express";
import uploadRoute from "./upload.route"
const router = Router();


router.use('/file-manager', uploadRoute)

export default router;