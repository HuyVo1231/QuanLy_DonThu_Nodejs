const mongoose = require('mongoose')
async function connect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/f8_nodejs_dev', {})
    console.log('Đã kết nối thành công đến MonggoDB')
  } catch (error) {
    console.log('Kết nối thất bại đến MonggoDB')
  }
}

module.exports = { connect }
