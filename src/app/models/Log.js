const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    name: String,
    action: String,
    data: Object,
    timestamp: { type: Date, default: () => moment().tz('Asia/Ho_Chi_Minh').toDate() }
});

module.exports = mongoose.model("Log", LogSchema);
