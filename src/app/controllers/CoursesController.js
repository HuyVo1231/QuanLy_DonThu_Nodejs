const User = require("../models/User");

class UserController {
    // [GET] /course/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .lean()
            .then((course) => {
                res.render("courses/show", { course, error: "error dang test" });
            })
            .catch(next);
    }
    create(req, res, next) {
        res.render("reception/create");
    }
    store(req, res, next) {
        const formData = req.body;
        formData.image = `https://scontent.fvca1-4.fna.fbcdn.net/v/t39.30808-6/423554209_1573711066797378_8104600272824157564_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeElqziXjfH9vEDevfcx_RvpCgxm2kIYT7MKDGbaQhhPs_2CmmQ3YOSjaLlCjiXQ2CZNeGkddtJJKgi2UK7VHhZd&_nc_ohc=tLmJrO2WPOIAb5NrJri&_nc_ht=scontent.fvca1-4.fna&oh=00_AfA0yolmFNhf1WyoJc5rETFr8FNEBE48S88ENk3BjpEX1Q&oe=661ABD41`;
        const course = new Course(formData);
        course
            .save()
            .then(() => {
                res.redirect("/me/stored/courses");
            })
            .catch(next);
    }

    // [GET] /course/:id/edit
    edit(req, res, next) {
        Course.findOne({ _id: req.params.id })
            .lean()
            .then((course) => {
                res.render("courses/edit", { course });
            })
            .catch(next);
    }

    // [PUT] /courses/:id
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/me/stored/courses"))
            .catch(next);
    }

    // [DELETE] /:id
    destroy(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PATCH] /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }
    
    // [DELETE] /courses/:id/force
    forceDestroy(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [] /courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch(req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            case 'restore':
                    Course.restore({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            case 'deleteGlobal':
                Course.deleteMany({ _id: { $in: req.body.courseIds } })
                .then(() => res.redirect("back"))
                .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid'});
        }
    }
}

module.exports = new UserController();
