const express = require("express");
const router = express.Router();
const loginController = require("../app/controllers/LoginController");
const {
    loggedin,
    isLogin,
    isAuth,
    register,
} = require("../app/middleware/auth");

router.get("/dangnhap", isLogin, loginController.showLoginForm);
router.post("/dangnhap", loginController.login);
router.get("/dangky", isLogin, register, loginController.showResForm);
router.post("/dangky", loginController.register);
router.get("/logout", isAuth, loginController.logout);

module.exports = router;
