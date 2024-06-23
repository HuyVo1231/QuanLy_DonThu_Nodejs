const mongoose = require("mongoose");
const Log = require("./Log");

const receptionSchema = new mongoose.Schema({
    hoten: {
        type: String,
        required: true,
        trim: true,
    },
    diachi: {
        type: String,
        required: true,
        trim: true,
    },
    sodienthoai: {
        type: String,
        trim: true,
    },
    coquannhan: {
        type: String,
        trim: true,
    },
    loaidonthu: {
        type: String,
        trim: true,
    },
    linhvuc: {
        type: String,
        trim: true,
    },
    ngaynhandon: {
        type: String,
        trim: true,
    },
    vanban_ngaychuyen: {
        type: String,
        trim: true,
    },
    vanban_ngaychuyen_file: { 
        type:String,
        trim:true,
    },
    ngaynhan_phanhoi_file: { 
        type:String,
        trim:true,
    },
    coquanthamquyen: {
        type: String,
        trim: true,
    },
    ngaynhanphanhoi: {
        type: String,
        trim: true,
    },
    trangthai: {
        type: String,
        required: true,
        trim: true,
    },
    ketqua: {
        type: String,
        trim: true,
    },
    noidung: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model("receptions", receptionSchema);