import { Router } from "express";
import uploadRoute from "./upload.route"
import mediaRoute from "./media.route"
const router = Router();


router.use('/file-manager', uploadRoute)
router.use('/media', mediaRoute)

export default router;