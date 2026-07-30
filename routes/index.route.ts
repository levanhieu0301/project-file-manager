import { Router } from "express";
import uploadRoute from "./upload.route"
import mediaRoute from "./media.route"
import  * as checkDomainAllow from "../middlewares/domain.middleware";
const router = Router();


router.use('/file-manager', uploadRoute)
router.use('/media',checkDomainAllow.checkDomain, mediaRoute)

export default router;