const User = require("../models/User");

class UsersController {
    // [GET] /user/profile
    show(req, res, next) {
        const infoUser = req.session.user;
        res.render("user/home", { infoUser });
    }

    async profileID(req, res, next) {
        try {
            const infoUser = await User.findOne({ _id: req.params.id }).lean();
            res.render("user/home", { infoUser });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await User.deleteOne({ _id: req.params.id });
            res.redirect("back");
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /user/:id
    async update(req, res, next) {
        const userId = req.params.id;

        try {
            // Lấy thông tin người dùng từ database
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Kiểm tra xem người dùng hiện tại có phải là người dùng đang cập nhật không
            const isCurrentUser =
                req.session.user && req.session.user._id.toString() === userId;

            // Cập nhật thông tin của người dùng từ req.body vào user
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.title = req.body.title || user.title;
            user.avatar = req.body.avatar || user.avatar;
            user.isActive = req.body.isActive || user.isActive;

            await user.save();

            // Nếu người dùng hiện tại là người dùng đang được cập nhật, thì cập nhật lại session
            if (!isCurrentUser) {
                res.redirect("/");
            }

            req.session.user = user;
            req.session.avatar = user.avatar;
            res.redirect("/user/profile");
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UsersController();
