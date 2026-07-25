import  { Request, Response } from "express"
import fs from "fs"
import path from "path"

// export const getFile = (req: Request, res: Response) => {
//   const filename = req.params.filename;

//   // Đường dẫn đến file
//   const filePath = path.join(__dirname, "../media", filename)

// }
export const getFile = (req: Request, res: Response) => {
  const filename = req.params.filename as string;
  
  // Đường dẫn đến file
  const mediaPath = path.join(__dirname, "../media", filename);

  res.sendFile(mediaPath);
}
