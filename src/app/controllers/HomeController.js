const User = require("../models/User");
const DateModel = require("../models/Date");
const Reception = require("../models/Reception");

class HomeController {
    async index(req, res, next) {
        try {
            let userAdmin = false;
            if (req.session.user && req.session.user.isAdmin) {
                userAdmin = true;
            }

            const userCount = await User.countDocuments();
            const dateCount = await DateModel.countDocuments();
            const receptionCount = await Reception.countDocuments();
            const resolvedCount = await Reception.countDocuments({
                trangthai: "Đã xử lý",
            });
            // Get the list of users from the database
            const users = await User.find().lean();
            // Add the userAdmin field to each user object
            users.forEach((user) => {
                user.userAdmin = userAdmin;
            });
            // Render the home template with the list of users
            res.render("home/home", {
                users,
                userCount,
                dateCount,
                receptionCount,
                resolvedCount,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new HomeController();
