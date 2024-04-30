const mongoose = require("mongoose");

const dateSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        trim: true,
    },
    chuyenvienphucvu: {
        type: String,
        trim: true,
    },
    ghichu: {
        type: String,
        trim: true,
    },
    lanhdaotiep: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model("dates", dateSchema);
