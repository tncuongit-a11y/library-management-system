const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
    msnv: { type: String, required: true, unique: true },
    hoTen: { type: String, required: true },
    password: { type: String, required: true },
    chucVu: { type: String, required: true, default: 'Nhân viên' },
    diaChi: { type: String, required: true },
    soDienThoai: { type: String, required: true }
}, { timestamps: true });

// SỬA LẠI ĐOẠN NÀY: Bỏ chữ next đi, dùng thuần async/await
staffSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    // Không cần try/catch và next() vì Mongoose sẽ tự catch lỗi của Promise
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: Kiểm tra password
staffSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Staff', staffSchema);