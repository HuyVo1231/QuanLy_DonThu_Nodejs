const User = require("../models/User");
const jwt = require("jsonwebtoken");
const notifier = require("node-notifier");

class LoginController {
    showLoginForm(req, res) {
        res.render("dangnhap/login", { isLoginPage: true });
    }

    async login(req, res) {
        const { name, password } = req.body;
        try {
            const user = await User.findOne({ name: name });
            if (!user || user.password !== password) {
                notifier.notify({
                    title: "Đăng nhập thất bại",
                    message: "Vui lòng kiểm tra tài khoản hoặc mật khẩu!",
                    timeout: 2,
                });
                return res.redirect("/login/dangnhap");
            }

            // Kiểm tra nếu tài khoản chưa được kích hoạt hoặc không phải là admin
            if (!user.isActive && !user.isAdmin) {
                notifier.notify({
                    title: "Đăng nhập thất bại",
                    message: "Tài khoản chưa được kích hoạt!",
                    timeout: 2,
                });
                return res.redirect("/login/dangnhap");
            }
            req.session.user = user;
            req.session.avatar = user.avatar;
            notifier.notify({
                title: "Đăng nhập thành công",
                message: "Chào mừng bạn đã đăng nhập!",
                timeout: 1,
                icon: "https://cdn-icons-png.flaticon.com/512/148/148767.png",
            });
            res.redirect("/");
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            res.status(500).send("Đã xảy ra lỗi");
        }
    }

    showResForm(req, res) {
        res.render("dangnhap/register", { isLoginPage: true });
    }

    async register(req, res, next) {
        const { name, password, repassword, role, title, email } = req.body;
        try {
            if (!name || !password || !repassword || !role || !title || !email) {
                notifier.notify({
                    title: "Điền đầy đủ các trường",
                    message: "Vui lòng nhập đầy đủ thông tin!",
                    timeout: 2,
                });
                return res.redirect("/login/dangky");
            }

            if (password !== repassword) {
                notifier.notify({
                    title: "Sai mật khẩu",
                    message: "Vui lòng nhập mật khẩu giống nhau!",
                    timeout: 2,
                });
                return res.redirect("/login/dangky");
            }

            const existingUser = await User.findOne({ name });
            if (existingUser) {
                notifier.notify({
                    title: "Tài khoản đã tồn tại",
                    message: "Vui lòng chọn tên tài khoản khác!",
                    timeout: 2,
                });
                return res.redirect("/login/dangky");
            }
            const isAdmin = false;
            const isActive = false;
            const avatarDefault =
                "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";
            const newUser = new User({ name, password, avatar: avatarDefault, title, role, email, isAdmin, isActive });
            await newUser.save();

            notifier.notify({
                title: "Đăng ký thành công",
                message: "Giờ hãy đăng nhập!",
                timeout: 2,
            });
            return res.redirect("/login/dangnhap");
        } catch (error) {
            notifier.notify({
                title: error.title,
                message: error.message,
                timeout: 2,
            });
            return res.redirect("/login/dangky");
        }
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Lỗi khi đăng xuất:", err);
            }
            res.redirect("/login/dangnhap");
        });
    }
}

module.exports = new LoginController();
