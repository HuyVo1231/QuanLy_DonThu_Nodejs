const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
    {
        name: { type: String },
        description: { type: String },
        image: { type: String },
        videos_id: { type: String },
        level: { type: String },
        slug: { type: String, slug: "name", unique: true },
    },
    {
        timestamps: true,
    }
);

// Add plugins
mongoose.plugin(slug);
CourseSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

// Custom query helpers
CourseSchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty("_sort")) {
        const isValidtype = ["asc", "desc"].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidtype ? req.query.type : "asc",
        });
    }
    return this;
};

// exports
module.exports = mongoose.model("Course", CourseSchema);
