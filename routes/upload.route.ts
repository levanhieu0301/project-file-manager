import { Router } from "express";
const router = Router();
import * as uploadController from "../controllers/file-manager.controller"
import multer from "multer";
const upload = multer();

router.post('/upload',upload.array("files"), uploadController.upload)
router.patch('/change-file-name',upload.none(), uploadController.changeFileName)
router.patch('/delete-file',upload.none(), uploadController.deleteFileName)
router.post('/folder/create',upload.none(), uploadController.folderCreate)
router.get('/folder/list',upload.none(), uploadController.folderList)

router.patch(
  '/folder/delete', 
  upload.none(), 
  uploadController.deleteFolder
);


export default router;