const express = require('express')
const homerouter = express.Router()
const homeController = require('../app/controllers/HomeController')
const { loggedin, isAuth } = require('../app/middleware/auth')

homerouter.get('/', homeController.index)

module.exports = homerouter
