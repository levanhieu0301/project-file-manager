import  { Request, Response } from "express"
import fs, { existsSync } from "fs"
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

export const changeFileName = (req: Request, res: Response) => {
try {
    const {folder, oldName, newName} = req.body;

  if(!folder || !oldName || !newName) {
    res.json({
      code: "error",
      message: "Thiếu thông tin cần thiết!"
    })
    return;
  }
  // Tạo đường dẫn đến thư mục đó
  const cleanFolder = folder.replace("/", "")// làm sạch đường dẫn
  const mediaDir = path.join(__dirname, "..", cleanFolder)
  const oldPath = path.join(mediaDir, oldName);
  const newPath = path.join(mediaDir, newName);
  if(!existsSync(oldPath)){
    res.json({
        code: "error",
        message: "File không tồn tại!"
      })
      return;

  }
  if(fs.existsSync(newPath)) {
      res.json({
        code: "error",
        message: "Tên file mới đã tồn tại!"
      })
      return;
    }
   // Đổi tên file
    fs.renameSync(oldPath, newPath);

    res.json({
      code: "success",
      message: "Thành công!"
    })
} catch (error) {
    res.json({
      code: "error",
      message: "Lỗi server khi đổi tên file!"
    })
}

}


export const deleteFileName = (req: Request, res: Response) => {
try {
    const {folder,fileName} = req.body;

  if(!folder || !fileName) {
    res.json({
      code: "error",
      message: "Thiếu thông tin cần thiết!"
    })
    return;
  }
  // Tạo đường dẫn đến thư mục đó
  const cleanFolder = folder.replace("/", "")// làm sạch đường dẫn
  const mediaDir = path.join(__dirname, "..", cleanFolder)
  const deletePath = path.join(mediaDir, fileName);
  if(!existsSync(deletePath)){
    res.json({
        code: "error",
        message: "File không tồn tại!"
      })
      return;

  }
   // Đổi tên file
    fs.unlinkSync(deletePath);

    res.json({
      code: "success",
      message: "Thành công!"
    })
} catch (error) {
    res.json({
      code: "error",
      message: "Lỗi server khi đổi tên file!"
    })
}

}
