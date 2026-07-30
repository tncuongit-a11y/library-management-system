require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./app/config');
const Publisher = require('./app/models/publisher.model');
const Book = require('./app/models/book.model');
const Reader = require('./app/models/reader.model');
const Staff = require('./app/models/staff.model');
const Borrow = require('./app/models/borrow.model');

// Kết nối DB
mongoose.connect(config.db.uri).then(() => console.log('Đang kết nối Database...'));

const seedDatabase = async () => {
    try {
        console.log('🧹 Đang dọn dẹp dữ liệu cũ (nếu có)...');
        await Promise.all([
            Publisher.deleteMany({}), Book.deleteMany({}),
            Reader.deleteMany({}), Staff.deleteMany({}), Borrow.deleteMany({})
        ]);

        console.log('👤 Đang tạo Nhân viên...');
        const staffs = await Staff.create([
            { msnv: 'NV001', hoTen: 'Nguyễn Trần Quản Lý', password: 'password123', chucVu: 'Quản lý', diaChi: 'Q1, TP.HCM', soDienThoai: '0901111111' },
            { msnv: 'NV002', hoTen: 'Trần Thị Thu Ngân', password: 'password123', chucVu: 'Nhân viên', diaChi: 'Q3, TP.HCM', soDienThoai: '0902222222' }
        ]);

        console.log('🏢 Đang tạo Nhà Xuất Bản...');
        const pubs = await Publisher.insertMany([
            { maNXB: 'NXB_TRE', tenNXB: 'Nhà Xuất Bản Trẻ', diaChi: '161B Lý Chính Thắng, Quận 3, TP.HCM' },
            { maNXB: 'NXB_KIMDONG', tenNXB: 'Nhà Xuất Bản Kim Đồng', diaChi: '55 Quang Trung, Hai Bà Trưng, Hà Nội' },
            { maNXB: 'NXB_NHANAM', tenNXB: 'Nhã Nam', diaChi: '59 Đỗ Quang, Cầu Giấy, Hà Nội' },
            { maNXB: 'NXB_TONGHOP', tenNXB: 'NXB Tổng Hợp TP.HCM', diaChi: '62 Nguyễn Thị Minh Khai, Quận 1, TP.HCM' }
        ]);

        const pTre = pubs.find(p => p.maNXB === 'NXB_TRE')._id;
        const pKimDong = pubs.find(p => p.maNXB === 'NXB_KIMDONG')._id;
        const pNhaNam = pubs.find(p => p.maNXB === 'NXB_NHANAM')._id;
        const pTongHop = pubs.find(p => p.maNXB === 'NXB_TONGHOP')._id;

        console.log('📚 Đang tạo Sách thực tế kèm ảnh bìa...');
        const books = await Book.insertMany([
            { maSach: 'S001', tenSach: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', hinhAnh: 'https://upload.wikimedia.org/wikipedia/vi/d/d4/T%C3%B4i_th%E1%BA%A5y_hoa_v%C3%A0ng_tr%C3%AAn_c%E1%BB%8F_xanh.jpg', donGia: 95000, soQuyen: 25, namXuatBan: 2015, tacGia: 'Nguyễn Nhật Ánh', nhaXuatBan: pTre },
            { maSach: 'S002', tenSach: 'Dế Mèn Phiêu Lưu Ký', hinhAnh: 'https://upload.wikimedia.org/wikipedia/vi/8/85/Demenphieuluuky.jpg', donGia: 45000, soQuyen: 50, namXuatBan: 2020, tacGia: 'Tô Hoài', nhaXuatBan: pKimDong },
            { maSach: 'S003', tenSach: 'Đất Rừng Phương Nam', hinhAnh: 'https://upload.wikimedia.org/wikipedia/vi/thumb/9/91/Datrungphuongnam.jpg/220px-Datrungphuongnam.jpg', donGia: 65000, soQuyen: 30, namXuatBan: 2018, tacGia: 'Đoàn Giỏi', nhaXuatBan: pKimDong },
            { maSach: 'S004', tenSach: 'Lược Sử Loài Người', hinhAnh: 'https://upload.wikimedia.org/wikipedia/vi/thumb/0/05/Sapiens_-_L%C6%B0%E1%BB%A3c_s%E1%BB%AD_lo%C3%A0i_ng%C6%B0%E1%BB%9Di.jpg/220px-Sapiens_-_L%C6%B0%E1%BB%A3c_s%E1%BB%AD_lo%C3%A0i_ng%C6%B0%E1%BB%9Di.jpg', donGia: 185000, soQuyen: 15, namXuatBan: 2021, tacGia: 'Yuval Noah Harari', nhaXuatBan: pNhaNam },
            { maSach: 'S005', tenSach: 'Đắc Nhân Tâm', hinhAnh: 'https://upload.wikimedia.org/wikipedia/vi/1/1a/%C4%90%E1%BA%AFc_nh%C3%A2n_t%C3%A2m.jpg', donGia: 86000, soQuyen: 100, namXuatBan: 2019, tacGia: 'Dale Carnegie', nhaXuatBan: pTongHop },
            { maSach: 'S006', tenSach: 'Cây Cam Ngọt Của Tôi', hinhAnh: 'https://upload.wikimedia.org/wikipedia/vi/thumb/0/07/C%C3%A2y_cam_ng%E1%BB%8Dt_c%E1%BB%A7a_t%C3%B4i_%28b%C3%ACa_s%C3%A1ch%29.jpg/220px-C%C3%A2y_cam_ng%E1%BB%8Dt_c%E1%BB%A7a_t%C3%B4i_%28b%C3%ACa_s%C3%A1ch%29.jpg', donGia: 108000, soQuyen: 40, namXuatBan: 2022, tacGia: 'José Mauro de Vasconcelos', nhaXuatBan: pNhaNam }
        ]);

        console.log('🧑‍🎓 Đang tạo Độc giả...');
        const readers = await Reader.insertMany([
            { maDocGia: 'DG001', hoLot: 'Lê Văn', ten: 'Nam', ngaySinh: '2000-05-15', phai: 'Nam', diaChi: 'Đại học Cần Thơ', dienThoai: '0981234567' },
            { maDocGia: 'DG002', hoLot: 'Phạm Thị', ten: 'Hoa', ngaySinh: '2002-10-20', phai: 'Nữ', diaChi: 'Ninh Kiều, Cần Thơ', dienThoai: '0919876543' },
            { maDocGia: 'DG003', hoLot: 'Vũ Hoàng', ten: 'Long', ngaySinh: '1998-02-28', phai: 'Nam', diaChi: 'Quận 1, TP.HCM', dienThoai: '0934567890' }
        ]);

        console.log('🔄 Đang tạo Phiếu mượn mẫu...');
        await Borrow.insertMany([
            { docGia: readers[0]._id, sach: books[0]._id, ngayMuon: new Date(Date.now() - 5 * 86400000), ngayTra: null }, // Mượn 5 ngày trước, chưa trả
            { docGia: readers[1]._id, sach: books[3]._id, ngayMuon: new Date(Date.now() - 10 * 86400000), ngayTra: new Date() }, // Đã trả
            { docGia: readers[2]._id, sach: books[4]._id, ngayMuon: new Date(Date.now() - 2 * 86400000), ngayTra: null } // Đang mượn
        ]);

        // Cập nhật lại số lượng kho sách cho khớp với phiếu mượn chưa trả
        await Book.findByIdAndUpdate(books[0]._id, { $inc: { soQuyen: -1 } });
        await Book.findByIdAndUpdate(books[4]._id, { $inc: { soQuyen: -1 } });

        console.log('✅ Hoàn tất toàn bộ Database!');
        process.exit();
    } catch (err) {
        console.error('❌ Lỗi:', err);
        process.exit(1);
    }
};

seedDatabase();