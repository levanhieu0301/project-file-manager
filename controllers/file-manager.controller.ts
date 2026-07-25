import  { Request, Response } from "express"
import fs from "fs"
import path from "path"

export const upload = (req: Request, res: Response) => {
  try {
     const files = req.files as Express.Multer.File[]
    const mediaDir = path.join(__dirname, "../media")
    const saveLink : any[] = []
    files.forEach(file => {
      // Tên file muốn lưu
      const filename = `${Date.now()}-${file.originalname}`
      // Đường dẫn muốn lưu ở đâu
      const savePath = path.join(mediaDir, filename)
      // lưu 
      fs.writeFileSync(savePath, file.buffer)
      // lấy ra đường link trả về để lưu vào DB
      saveLink.push({
        folder: "/media",
        filename:filename,
        mimetype: file.mimetype,
        size: file.size
      })

    }) 

    res.json({
      code: "success",
      message:"Upload file thành công!",
      saveLink: saveLink
    })
  } catch (error) {
    res.json({
      code: "error",
      message:"Lỗi upload!",
    })
  }
}