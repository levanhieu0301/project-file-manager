import  { Request, Response } from "express"
import fs, { existsSync } from "fs"
import path from "path"

export const upload = (req: Request, res: Response) => {
  try {
     const files = req.files as Express.Multer.File[]
     const folderPath = req.body.folderPath

    let mediaDir = path.join(__dirname, "../media")
    if(folderPath != undefined){
      mediaDir= path.join(mediaDir, folderPath)
    }
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
        folder: "/media" + (folderPath != undefined ? `/${folderPath}` : ""),
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

export const folderCreate = (req: Request, res: Response) => {
try {
    const { valueFolder, folderCurrent } = req.body;
  if(!valueFolder && typeof valueFolder !== "string"){
    res.json({
        code: "error",
        message: "Tên thư mục không hợp lệ!"
      })
    return;
  }
  // Thư mục gốc
  const mediaDir = path.join(__dirname, "..", "media")
  // Tạo đường dẫn tạo folder
  const createFolderPath = path.join(mediaDir,folderCurrent || "", valueFolder)
  // Kiểm  tra tên folder tồn tại hay chưa
  if(fs.existsSync(createFolderPath)){
    res.json({
        code: "error",
        message: "Folder đã tồn tại!"
      })
      return;
  }
  // Tạo folder
  fs.mkdirSync(createFolderPath)
  res.json({
      code: "success",
      message: "Thành công!"
  })
} catch (error) {
   res.json({
      code: "error",
      message: "Lỗi server khi tạo folder!"
    })
}

}
export const folderList = (req: Request, res: Response) => {
try {
  const folders: any[] = []
  //Tạo thư mục gốc
  let mediaDir = path.join(__dirname, "..", "media")
  // Lấy danh sách folder trong folder
  if(req.query.folderPath !== "undefined"){
    mediaDir = path.join(mediaDir, `${req.query.folderPath}`)
  }
  // Lấy ra tất các file/ folder trong thư mục media
  const list = fs.readdirSync(mediaDir)
  //lặp qua danh sách Kiểm tra nào là folder 
  list.forEach(item => {
    // Tạo đường dẫn đến từng item để kiểm tra
    const itemPath = path.join(mediaDir, item)
    // Kiểm tra
    const itemInfo = fs.statSync(itemPath) // trả về thông tin chi tiết 
    // check thư mục 
    if(itemInfo.isDirectory()){
      folders.push({
        nameFolder : item,
        createdAt : itemInfo.birthtime
      })
    }
  })
  // Sắp xếp giảm dần theo ngày tạo
  folders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  res.json({
      code: "success",
      message: "Thành công!",
      folderList: folders
  })
} catch (error) {
  res.json({
      code: "error",
      message: "Lấy danh sách folder không thành công!"
  })
}}
export const deleteFolder = (req: Request, res: Response) => {
  try {
    const { folderPath } = req.body;

    if(!folderPath) {
      res.json({
        code: "error",
        message: "Thiếu đường dẫn folder!"
      })
      return;
    }

    if(folderPath == "media" || folderPath == "/media") {
      res.json({
        code: "error",
        message: "Không được phép xóa thư mục này!"
      })
      return;
    }

    // Tạo đường dẫn đến folder
    const folderDir = path.join(__dirname, "..", folderPath);

    if(!fs.existsSync(folderDir)) {
      res.json({
        code: "error",
        message: "Folder không tồn tại!"
      })
      return;
    }

    // Xóa folder
    fs.rmSync(folderDir, {
      recursive: true
    });
    // recursive: để xóa các folder và các file con bên trong

    res.json({
      code: "success",
      message: "Thành công!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi server khi xóa folder!"
    })
  }
}
