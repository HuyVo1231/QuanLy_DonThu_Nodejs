const Reception = require('../models/Reception')
const DateModel = require('../models/Date')
const LogModel = require('../models/Log')
const excel = require('exceljs')
const moment = require('moment')

class ReceptionController {
  create(req, res, next) {
    res.render('reception/create')
  }

  async store(req, res, next) {
    try {
      const dataAdd = req.body
      // Lấy dữ liệu từ request
      const { ngaynhandon } = req.body
      // Lấy đường dẫn của các file
      const vanban_ngaychuyen_file = req.files['vanban_ngaychuyen_file'][0].path
      const ngaynhan_phanhoi_file = req.files['ngaynhan_phanhoi_file'][0].path

      // Xử lý đường dẫn của file
      const newVanBanFile = vanban_ngaychuyen_file.replace('src\\public\\img\\', '')
      const newPhanHoiFile = ngaynhan_phanhoi_file.replace('src\\public\\img\\', '')

      // Kiểm tra nếu ngày nhận đơn đã tồn tại
      const date = await DateModel.findOne({ date: ngaynhandon }).lean()
      if (date) {
        // Nếu ngày đã tồn tại, tạo một bản ghi mới của đơn thư và lưu vào cơ sở dữ liệu
        const receptionData = {
          ...req.body,
          date: ngaynhandon,
          vanban_ngaychuyen_file: newVanBanFile,
          ngaynhan_phanhoi_file: newPhanHoiFile
        }
        const reception = new Reception(receptionData)
        await reception.save()
        const logReception = new LogModel({ name: req.session.user.name, action: 'thêm', data: dataAdd })
        await logReception.save()
      } else {
        // Nếu ngày chưa tồn tại, tạo một bản ghi mới của ngày và đơn thư, sau đó lưu vào cơ sở dữ liệu
        const newDate = new DateModel({ date: ngaynhandon })
        const receptionData = { ...req.body, vanban_ngaychuyen_file: newVanBanFile, ngaynhan_phanhoi_file: newPhanHoiFile }
        const reception = new Reception(receptionData)
        await Promise.all([newDate.save(), reception.save()])
      }

      // Chuyển hướng về trang danh sách đơn thư
      res.redirect('/donthu')
    } catch (error) {
      // Xử lý lỗi nếu có
      next(error)
    }
  }

  async details(req, res, next) {
    try {
      const ngayNhanDon = moment(req.params.date).format('DD-MM-YYYY')
      const data = await DateModel.find({ date: req.params.date }).lean()
      const lanhdaotiep = data[0].lanhdaotiep
      const receptions = await Reception.find({ ngaynhandon: req.params.date }).lean()
      res.render('reception/home', { receptions, ngayNhanDon, lanhdaotiep })
    } catch (error) {
      next(error)
    }
  }

  async search(req, res, next) {
    try {
      let searchCriteria = {}

      if (req.body.hoten) {
        searchCriteria.hoten = { $regex: new RegExp(req.body.hoten, 'i') }
      }

      if (req.body.trangthai) {
        searchCriteria.trangthai = req.body.trangthai
      }

      if (req.body.loaidonthu) {
        searchCriteria.loaidonthu = req.body.loaidonthu
      }

      if (req.body.linhVuc) {
        searchCriteria.linhvuc = req.body.linhVuc
      }

      if (req.body.tuNgay && req.body.denNgay) {
        const tuNgay = new Date(req.body.tuNgay)
        const denNgay = new Date(req.body.denNgay)

        // Format ngày thành chuỗi trong định dạng YYYY-MM-DD
        const tuNgayFormatted = tuNgay.toISOString().slice(0, 10)
        const denNgayFormatted = denNgay.toISOString().slice(0, 10)
        console.log(tuNgayFormatted, denNgayFormatted)
        // Thêm điều kiện tìm kiếm từ ngày này đến ngày kia
        searchCriteria.ngaynhandon = {
          $gte: tuNgayFormatted,
          $lte: denNgayFormatted
        }
      }

      const receptions = await Reception.find(searchCriteria).lean()
      res.render('reception/home', { receptions })
    } catch (error) {
      next(error)
    }
  }

  async show(req, res, next) {
    try {
      const receptions = await Reception.find({}).sort({ ngaynhandon: -1 }).lean()
      res.render('reception/home', { receptions })
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      const reception = await Reception.findOne({ _id: req.params.id }).lean()
      res.render('reception/edit', { reception })
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const receptionId = req.params.id
      const receptionData = req.body
      const dataEdit = req.body
      // Kiểm tra nếu có tệp tin văn bản ngày chuyển
      if (req.files['vanban_ngaychuyen_file']) {
        const vanban_ngaychuyen_file = req.files['vanban_ngaychuyen_file'][0].path
        const newVanBanFile = vanban_ngaychuyen_file.replace('src\\public\\img\\', '')
        receptionData.vanban_ngaychuyen_file = newVanBanFile
      }

      // Kiểm tra nếu có tệp tin ngày nhận phản hồi
      if (req.files['ngaynhan_phanhoi_file']) {
        const ngaynhan_phanhoi_file = req.files['ngaynhan_phanhoi_file'][0].path
        const newPhanHoiFile = ngaynhan_phanhoi_file.replace('src\\public\\img\\', '')
        receptionData.ngaynhan_phanhoi_file = newPhanHoiFile
      }
      const logReception = new LogModel({ name: req.session.user.name, action: 'chỉnh sửa', data: dataEdit })
      await logReception.save()
      // Cập nhật thông tin của đối tượng Reception
      await Reception.updateOne({ _id: receptionId }, receptionData)

      // Chuyển hướng sau khi cập nhật thành công
      res.redirect('/donthu/')
    } catch (error) {
      next(error)
    }
  }

  async destroy(req, res, next) {
    try {
      const dataDelete = await Reception.findOne({ _id: req.params.id }).lean()
      const logReception = new LogModel({ name: req.session.user.name, action: 'Xóa', data: dataDelete })
      await logReception.save()
      await Reception.deleteOne({ _id: req.params.id })
      res.redirect('/donthu/')
    } catch (error) {
      next(error)
    }
  }

  async log(req, res, next) {
    try {
      const logs = await LogModel.find({}).sort({ ngaynhandon: -1 }).lean()
      res.render('reception/log', { logs })
    } catch (error) {
      next(error)
    }
  }

  async excel(req, res, next) {
    try {
      // Nhận các ID từ req.body
      const receptionIds = req.body.receptionIds // Mảng các ID

      // Tạo Workbook và Worksheet
      const workbook = new excel.Workbook()
      const worksheet = workbook.addWorksheet('Data')

      // Định dạng tiêu đề cột
      const headerRow = worksheet.addRow([
        'Họ và tên',
        'Địa chỉ',
        'Số điện thoại',
        'Cơ quan nhận',
        'Loại đơn thư',
        'Lĩnh vực',
        'Ngày nhận đơn',
        'Văn bản ngày chuyển',
        'Văn bản ngày chuyển (file)',
        'Ngày nhận phản hồi (file)',
        'Cơ quan thẩm quyền',
        'Ngày nhận phản hồi',
        'Trạng thái',
        'Kết quả',
        'Nội dung'
      ])

      // Thiết lập kích thước cho từng cột
      const columnSizes = [20, 60, 20, 20, 20, 20, 20, 20, 30, 30, 20, 20, 20, 20, 20]
      for (let i = 1; i <= headerRow.cellCount; i++) {
        if (columnSizes[i - 1] !== null) {
          worksheet.getColumn(i).width = columnSizes[i - 1]
        }
      }

      // Định dạng hàng tiêu đề
      headerRow.font = { bold: true, name: 'Times New Roman', size: 14 } // Font Times New Roman, size 14
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4CAF50' } } // Màu xanh cho nền
      headerRow.alignment = { horizontal: 'center' }

      // Query data từ MongoDB
      const receptions = await Reception.find({ _id: { $in: receptionIds } }).select(
        '-_id hoten diachi sodienthoai coquannhan loaidonthu linhvuc ngaynhandon vanban_ngaychuyen vanban_ngaychuyen_file ngaynhan_phanhoi_file coquanthamquyen ngaynhanphanhoi trangthai ketqua noidung'
      )

      // Thêm dữ liệu từ MongoDB vào Excel và định dạng dữ liệu
      receptions.forEach((reception, index) => {
        const row = worksheet.addRow([
          reception.hoten,
          reception.diachi,
          reception.sodienthoai,
          reception.coquannhan,
          reception.loaidonthu,
          reception.linhvuc,
          formatDate(reception.ngaynhandon),
          reception.vanban_ngaychuyen,
          reception.vanban_ngaychuyen_file,
          reception.ngaynhan_phanhoi_file,
          reception.coquanthamquyen,
          formatDate(reception.ngaynhanphanhoi),
          reception.trangthai,
          reception.ketqua,
          reception.noidung
        ])

        // Định dạng màu xen kẽ cho các dòng
        if (index % 2 === 0) {
          row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E0E0E0' } } // Màu xám nhạt cho nền
        }

        // Thiết lập font và căn chỉnh từ trái sang phải cho dữ liệu
        row.font = { name: 'Times New Roman', size: 13 }
        row.alignment = { horizontal: 'left' }
      })

      // Định dạng cột ngày tháng
      const dateColumns = ['G', 'H', 'K', 'M']
      dateColumns.forEach((col) => {
        worksheet.getColumn(col).numFmt = 'dd/mm/yyyy'
      })

      // Thiết lập định dạng border cho toàn bộ bảng
      worksheet.eachRow({ includeEmpty: true }, function (row) {
        row.eachCell({ includeEmpty: true }, function (cell) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          } // Định dạng border cho ô
        })
      })

      // Định dạng file Excel và gửi về client
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=' + 'receptions.xlsx')
      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      next(error)
    }
  }
}

// Hàm định dạng ngày tháng
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('vi-VN', options)
}

module.exports = new ReceptionController()
