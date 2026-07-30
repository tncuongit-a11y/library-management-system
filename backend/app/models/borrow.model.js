const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    docGia: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Reader', 
        required: true 
    },
    sach: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
    ngayMuon: { type: Date, default: Date.now },
    ngayPhaiTra: { 
        type: Date, 
        default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) 
    },
    ngayTra: { type: Date, default: null }, // Null = Đang mượn, chưa trả
    soLanGiaHan: { type: Number, default: 0 },
    phiPhat: { type: Number, default: 0 },
    trangThai: { 
        type: String, 
        enum: ['CHO_DUYET', 'DANG_MUON', 'QUA_HAN', 'DA_TRA', 'TU_CHOI'], 
        default: 'DANG_MUON' 
    },
    ghiChu: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Borrow', borrowSchema);