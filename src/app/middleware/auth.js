const isAuth = (req, res, next) => {
    // Kiểm tra xem có thông tin người dùng trong session hay không
    if (req.session && req.session.user) {
        next();
    } else {
        req.session.returnTo = req.originalUrl;
        res.render("dangnhap/login", { isLoginPage: true });
    }
};

const loggedin = (req, res, next) => {
    // Kiểm tra xem có thông tin người dùng trong session hay không
    if (req.session.login || req.session.user || req.session) {
        next();
    } else {
        res.render("dangnhap/login", { isLoginPage: true });
    }
};

const isLogin = (req, res, next) => {
    // Kiểm tra xem có thông tin người dùng trong session hay không
    if (req.session.user && req.session) {
        res.render("home/home");
    } else {
        next();
    }
};

const sendAvatarGlobal = (req, res, next) => {
    // Kiểm tra nếu có session và có avatar, thì truyền avatar vào locals
    res.locals.avatar = req.session.avatar;
    res.locals.user = req.session.user;
    next();
};

const register = (req, res, next) => {
    res.render("dangnhap/register", { isLoginPage: true });
};

const isAdmin = (req, res, next) => {
    // Kiểm tra xem có thông tin người dùng trong session và người dùng có quyền admin không
    if (req.session && req.session.user && req.session.user.isAdmin) {
        next(); 
    } else {
        // Nếu không phải admin, chuyển hướng hoặc trả về lỗi 403 (Forbidden)
        res.status(403).send("You cant access this");
    }
};

module.exports = {
    isAuth,
    loggedin,
    isLogin,
    register,
    sendAvatarGlobal,
    isAdmin,
};
