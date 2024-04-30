const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: String,
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
    },
    role: {
        type: String,
    },
    title: String,
    isAdmin: Boolean,
});

module.exports = mongoose.model("User", userSchema);
