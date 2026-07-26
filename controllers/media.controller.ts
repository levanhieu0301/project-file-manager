import  { Request, Response } from "express"
import fs from "fs"
import path from "path"

export const getFile = (req: Request, res: Response) => {
  const filename = req.params.filename as string;
  const type = req.query.type;
  
  // Đường dẫn đến file
  const mediaPath = path.join(__dirname, "../media", filename);

  if(type == "download"){
    res.download(mediaPath)
  }else {
    res.sendFile(mediaPath);
  }
}
