import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Public')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${file.fieldname}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //5 MB
})

export default upload