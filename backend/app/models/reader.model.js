const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const readerSchema = new mongoose.Schema({
    maDocGia: { type: String, required: true, unique: true },
    hoLot: { type: String, required: true },
    ten: { type: String, required: true, index: true },
    ngaySinh: { type: Date, required: true },
    phai: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: 'Khác' },
    diaChi: { type: String, required: true },
    dienThoai: { type: String, required: true, index: true },
    email: { type: String, default: '' },
    matKhau: { type: String, default: null, select: false }
}, { timestamps: true });

readerSchema.pre('save', async function () {
    if (!this.isModified('matKhau') || !this.matKhau) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.matKhau = await bcrypt.hash(this.matKhau, salt);
});

readerSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.matKhau) return false;
    return await bcrypt.compare(candidatePassword, this.matKhau);
};

module.exports = mongoose.model('Reader', readerSchema);