const express = require('express')
const router = express.Router()
const receptionController = require('../app/controllers/ReceptionController')
const { loggedin, isAuth, isAdmin } = require('../app/middleware/auth')
const path = require('path')

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/img/') // Đường dẫn lưu trữ file
  },
  filename: function (req, file, cb) {
    // Lấy tên file và mở rộng của nó
    const ext = path.extname(file.originalname)
    // Tạo một tên file mới không có đường dẫn
    const filename = Date.now() + '-' + file.originalname.replace(ext, '').toLowerCase().split(' ').join('-') + ext
    cb(null, filename)
  }
})

const upload = multer({ storage: storage })
router.post('/xuatFile', isAdmin, receptionController.excel)
router.get('/showlog', isAdmin, receptionController.log)
router.get('/taodonthu', receptionController.create)
router.post('/timkiem', receptionController.search)
router.post(
  '/store',
  upload.fields([
    { name: 'vanban_ngaychuyen_file', maxCount: 1 },
    { name: 'ngaynhan_phanhoi_file', maxCount: 1 }
  ]),
  receptionController.store
)

router.get('/', receptionController.show)
router.get('/:date/details', receptionController.details)
router.get('/:id/edit', receptionController.edit)
router.put(
  '/:id',
  upload.fields([
    { name: 'vanban_ngaychuyen_file', maxCount: 1 },
    { name: 'ngaynhan_phanhoi_file', maxCount: 1 }
  ]),
  receptionController.update
)
router.delete('/:id', receptionController.destroy)

module.exports = router
