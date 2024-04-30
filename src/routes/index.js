const homeRouter = require("./home");
const loginRouter = require("./login");
const dateRouter = require("./date");
const receptionRouter = require("./reception");
const userRouter = require("./user");

const {
    loggedin,
    isAuth,
    sendAvatarGlobal,
} = require("../app/middleware/auth");

function route(app) {
    app.use("/", sendAvatarGlobal, loggedin, homeRouter);
    app.use("/login", loginRouter);
    app.use("/donthu", isAuth, receptionRouter);
    app.use("/ngaytiepdan", isAuth, dateRouter);
    app.use("/user", isAuth, userRouter);
}

module.exports = route;
