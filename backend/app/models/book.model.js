// const mongoose = require('mongoose');

// const bookSchema = new mongoose.Schema({
//     maSach: { type: String, required: true, unique: true },
//     tenSach: { type: String, required: true, index: true },
//     donGia: { type: Number, required: true, min: 0 },
//     soQuyen: { type: Number, required: true, min: 0 },
//     namXuatBan: { type: Number, required: true },
//     tacGia: { type: String, required: true, index: true },
//     hinhAnh: { type: String, default: '' },
//     nhaXuatBan: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'Publisher', 
//         required: true 
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('Book', bookSchema);
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    tenDocGia: { type: String, required: true },
    diem: { type: Number, required: true, min: 1, max: 5 },
    nhanXet: { type: String, default: '' },
    ngayTao: { type: Date, default: Date.now }
});

const bookSchema = new mongoose.Schema({
    maSach: { type: String, required: true, unique: true },
    tenSach: { type: String, required: true, index: true },
    hinhAnh: { type: String, default: 'https://via.placeholder.com/150x200?text=No+Cover' },
    donGia: { type: Number, required: true, min: 0 },
    soQuyen: { type: Number, required: true, min: 0 },
    namXuatBan: { type: Number, required: true },
    tacGia: { type: String, required: true, index: true },
    nhaXuatBan: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Publisher', 
        required: true 
    },
    danhGia: [reviewSchema],
    diemTrungBinh: { type: Number, default: 5.0 },
    luotMuon: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);