const Reception = require("../models/Reception");
const DateModel = require("../models/Date"); // Import Date model
const moment = require("moment");

class DateController {
    create(req, res, next) {
        try {
            res.render("date/create");
        } catch (error) {
            next(error);
        }
    }

    async store(req, res, next) {
        try {
            const date = new DateModel(req.body);
            await date.save();
            res.redirect("/ngaytiepdan");
        } catch (error) {
            next(error);
        }
    }

    async edit(req, res, next) {
        try {
            const reception = await DateModel.findOne({ date: req.params.date }).lean();
            res.render("date/edit", { reception });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            await DateModel.updateOne({ date: req.params.date }, req.body);
            res.redirect("/ngaytiepdan");
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await DateModel.deleteOne({ date: req.params.date });
            res.redirect("back");
        } catch (error) {
            next(error);
        }
    }

    async showDay(req, res, next) {
        try {
            const dates = await DateModel.aggregate([
                {
                    $lookup: {
                        from: "receptions",
                        localField: "date",
                        foreignField: "ngaynhandon",
                        as: "receptions",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        lanhdaotiep: 1,
                        ghichu: 1,
                        chuyenvienphucvu: 1,
                        receptionCount: { $size: "$receptions" },
                    },
                },
            ]);

            const filteredDates = dates.filter(date => date.date === req.params.date);

            res.render("home/search", { dates: filteredDates });
        } catch (error) {
            next(error);
        }
    }

    async show(req, res, next) {
        try {
            const dates = await DateModel.aggregate([
                {
                    $lookup: {
                        from: "receptions",
                        localField: "date",
                        foreignField: "ngaynhandon",
                        as: "receptions",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        lanhdaotiep: 1,
                        ghichu: 1,
                        chuyenvienphucvu: 1,
                        receptionCount: { $size: "$receptions" },
                    },
                },
                { $sort: { date: -1 } }
            ]);

            res.render("date/home", { dates });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DateController();
