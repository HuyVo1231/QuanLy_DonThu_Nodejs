const Reception = require("../models/Reception");
const DateModel = require("../models/Date");
const moment = require("moment");

class ReceptionController {
    create(req, res, next) {
        res.render("reception/create");
    }

    async store(req, res, next) {
        try {
            const ngayNhanDon = req.body.ngaynhandon;
            const date = await DateModel.findOne({ date: ngayNhanDon }).lean();

            if (date) {
                const receptionData = req.body;
                receptionData.date = ngayNhanDon;
                const reception = new Reception(receptionData);
                await reception.save();
            } else {
                const newDate = new DateModel({ date: req.body.ngaynhandon });
                const reception = new Reception(req.body);
                await Promise.all([newDate.save(), reception.save()]);
            }

            res.redirect("/donthu");
        } catch (error) {
            next(error);
        }
    }

    async details(req, res, next) {
        try {
            const ngayNhanDon = moment(req.params.date).format("DD-MM-YYYY");
            const receptions = await Reception.find({ ngaynhandon: req.params.date }).lean();
            res.render("reception/home", { receptions, ngayNhanDon });
        } catch (error) {
            next(error);
        }
    }

    async search(req, res, next) {
        try {
            let searchCriteria = {};

            if (req.body.hoten) {
                searchCriteria.hoten = { $regex: new RegExp(req.body.hoten, "i") };
            }

            if (req.body.trangthai) {
                searchCriteria.trangthai = req.body.trangthai;
            }

            if (req.body.loaidonthu) {
                searchCriteria.loaidonthu = req.body.loaidonthu;
            }

            const receptions = await Reception.find(searchCriteria).lean();
            res.render("reception/home", { receptions });
        } catch (error) {
            next(error);
        }
    }

    async show(req, res, next) {
        try {
            const receptions = await Reception.find({}).sort({ ngaynhandon: -1 }).lean();
            res.render("reception/home", { receptions });
        } catch (error) {
            next(error);
        }
    }

    async edit(req, res, next) {
        try {
            const reception = await Reception.findOne({ _id: req.params.id }).lean();
            res.render("reception/edit", { reception });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            await Reception.updateOne({ _id: req.params.id }, req.body);
            res.redirect("/donthu/");
        } catch (error) {
            next(error);
        }
    }

    async destroy(req, res, next) {
        try {
            await Reception.deleteOne({ _id: req.params.id });
            res.redirect("back");
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReceptionController();
