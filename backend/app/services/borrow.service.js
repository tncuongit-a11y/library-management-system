const Borrow = require('../models/borrow.model');
const Book = require('../models/book.model');
const Reader = require('../models/reader.model');
const ApiError = require('../utils/api-error');

class BorrowService {
    async createBorrow(data) {
        const book = await Book.findById(data.sach);
        if (!book) throw new ApiError(404, 'Không tìm thấy sách');
        if (book.soQuyen <= 0) throw new ApiError(400, 'Sách này đã hết, không thể mượn');

        if (!data.ngayPhaiTra) {
            const ngayMuon = data.ngayMuon ? new Date(data.ngayMuon) : new Date();
            data.ngayPhaiTra = new Date(ngayMuon.getTime() + 14 * 24 * 60 * 60 * 1000);
        }

        data.trangThai = data.trangThai || 'DANG_MUON';

        const borrow = await Borrow.create(data);

        if (data.trangThai === 'DANG_MUON') {
            book.soQuyen -= 1;
            book.luotMuon = (book.luotMuon || 0) + 1;
            await book.save();
        }

        return borrow;
    }

    async createOnlineRequest(data) {
        let reader = await Reader.findOne({ dienThoai: data.dienThoai });
        if (!reader) {
            reader = await Reader.create({
                maDocGia: 'DG' + Date.now().toString().slice(-5),
                hoLot: data.hoLot || 'Độc giả',
                ten: data.ten || 'Trực tuyến',
                dienThoai: data.dienThoai,
                diaChi: data.diaChi || 'Đăng ký online',
                phai: data.phai || 'Khác'
            });
        }

        const book = await Book.findById(data.sachId);
        if (!book) throw new ApiError(404, 'Không tìm thấy sách');
        if (book.soQuyen <= 0) throw new ApiError(400, 'Sách này hiện đã hết trong kho, vui lòng quay lại sau.');

        const existingPending = await Borrow.findOne({
            docGia: reader._id,
            sach: book._id,
            trangThai: { $in: ['CHO_DUYET', 'DANG_MUON', 'QUA_HAN'] },
            ngayTra: null
        });

        if (existingPending) {
            throw new ApiError(400, 'Bạn đang mượn hoặc đã đăng ký mượn cuốn sách này rồi.');
        }

        const borrow = await Borrow.create({
            docGia: reader._id,
            sach: book._id,
            trangThai: 'CHO_DUYET',
            ghiChu: data.ghiChu || 'Đăng ký mượn trực tuyến'
        });

        return { borrow, reader };
    }

    async processOnlineRequest(id, action) {
        const borrow = await Borrow.findById(id).populate('sach');
        if (!borrow) throw new ApiError(404, 'Không tìm thấy yêu cầu mượn');
        if (borrow.trangThai !== 'CHO_DUYET') throw new ApiError(400, 'Yêu cầu này đã được xử lý trước đó');

        if (action === 'approve') {
            if (borrow.sach.soQuyen <= 0) throw new ApiError(400, 'Sách hiện không đủ số lượng trong kho');
            
            borrow.trangThai = 'DANG_MUON';
            borrow.ngayMuon = new Date();
            borrow.ngayPhaiTra = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
            await borrow.save();

            await Book.findByIdAndUpdate(borrow.sach._id, { 
                $inc: { soQuyen: -1, luotMuon: 1 } 
            });
        } else {
            borrow.trangThai = 'TU_CHOI';
            await borrow.save();
        }

        return borrow;
    }

    async extendBorrow(id) {
        const borrow = await Borrow.findById(id);
        if (!borrow) throw new ApiError(404, 'Không tìm thấy phiếu mượn');
        if (borrow.ngayTra) throw new ApiError(400, 'Sách đã được hoàn trả, không thể gia hạn');
        if (borrow.soLanGiaHan >= 2) throw new ApiError(400, 'Chỉ được gia hạn tối đa 2 lần cho mỗi lần mượn');

        const now = new Date();
        const dueDate = new Date(borrow.ngayPhaiTra);

        borrow.ngayPhaiTra = new Date(dueDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        borrow.soLanGiaHan += 1;
        if (now <= borrow.ngayPhaiTra) {
            borrow.trangThai = 'DANG_MUON';
        }
        await borrow.save();

        return borrow;
    }

    async returnBook(id) {
        const borrow = await Borrow.findById(id);
        if (!borrow) throw new ApiError(404, 'Không tìm thấy phiếu mượn');
        if (borrow.ngayTra) throw new ApiError(400, 'Sách này đã được trả trước đó');

        const now = new Date();
        borrow.ngayTra = now;
        borrow.trangThai = 'DA_TRA';

        const dueDate = new Date(borrow.ngayPhaiTra);
        if (now > dueDate) {
            const diffDays = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
            borrow.phiPhat = diffDays * 5000;
        } else {
            borrow.phiPhat = 0;
        }

        await borrow.save();

        await Book.findByIdAndUpdate(borrow.sach, { $inc: { soQuyen: 1 } });

        return borrow;
    }

    async getReaderHistory(phoneOrCode) {
        const reader = await Reader.findOne({
            $or: [
                { dienThoai: phoneOrCode.trim() },
                { maDocGia: phoneOrCode.trim() }
            ]
        });

        if (!reader) {
            throw new ApiError(404, 'Không tìm thấy thông tin độc giả với Mã hoặc SDT này');
        }

        const borrows = await Borrow.find({ docGia: reader._id })
            .populate('sach', 'maSach tenSach tacGia hinhAnh')
            .sort({ createdAt: -1 });

        const now = new Date();
        const formattedBorrows = borrows.map(b => {
            const isOverdue = !b.ngayTra && b.ngayPhaiTra && new Date(b.ngayPhaiTra) < now;
            let computedStatus = b.trangThai;
            if (isOverdue && b.trangThai === 'DANG_MUON') computedStatus = 'QUA_HAN';
            return {
                ...b.toObject(),
                computedStatus
            };
        });

        return {
            reader,
            borrows: formattedBorrows
        };
    }

    async getAll(query) {
        const { page = 1, limit = 10, status = '', search = '' } = query;
        let filter = {};
        
        if (status === 'borrowing') filter.trangThai = 'DANG_MUON';
        else if (status === 'overdue') filter.trangThai = 'QUA_HAN';
        else if (status === 'returned') filter.trangThai = 'DA_TRA';
        else if (status === 'pending') filter.trangThai = 'CHO_DUYET';

        const skip = (page - 1) * limit;

        const allBorrows = await Borrow.find(filter)
            .populate('docGia', 'maDocGia hoLot ten dienThoai')
            .populate({
                path: 'sach',
                select: 'maSach tenSach tacGia donGia hinhAnh',
                populate: { path: 'nhaXuatBan', select: 'tenNXB' }
            })
            .sort({ createdAt: -1 });

        const now = new Date();
        const updatedList = allBorrows.map(b => {
            const obj = b.toObject();
            if (!b.ngayTra && b.ngayPhaiTra && new Date(b.ngayPhaiTra) < now && b.trangThai === 'DANG_MUON') {
                obj.trangThai = 'QUA_HAN';
            }
            return obj;
        });

        let filteredResult = updatedList;
        if (search) {
            const term = search.toLowerCase().trim();
            filteredResult = updatedList.filter(b => {
                const readerName = `${b.docGia?.hoLot || ''} ${b.docGia?.ten || ''}`.toLowerCase();
                const bookTitle = (b.sach?.tenSach || '').toLowerCase();
                const readerCode = (b.docGia?.maDocGia || '').toLowerCase();
                const phone = (b.docGia?.dienThoai || '').toLowerCase();
                return readerName.includes(term) || bookTitle.includes(term) || readerCode.includes(term) || phone.includes(term);
            });
        }

        const total = filteredResult.length;
        const pagedData = filteredResult.slice(skip, skip + Number(limit));

        return {
            data: pagedData,
            pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) }
        };
    }
}

module.exports = new BorrowService();