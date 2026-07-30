const Book = require('../models/book.model');
const Reader = require('../models/reader.model');
const Borrow = require('../models/borrow.model');
const Publisher = require('../models/publisher.model');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const now = new Date();
        const [
            totalBooks,
            totalReaders,
            totalBorrows,
            unreturnedBorrows,
            pendingBorrows,
            overdueBorrows,
            topBooks,
            publishers
        ] = await Promise.all([
            Book.countDocuments(),
            Reader.countDocuments(),
            Borrow.countDocuments({ trangThai: { $ne: 'TU_CHOI' } }),
            Borrow.countDocuments({ ngayTra: null, trangThai: { $in: ['DANG_MUON', 'QUA_HAN'] } }),
            Borrow.countDocuments({ trangThai: 'CHO_DUYET' }),
            Borrow.countDocuments({ 
                ngayTra: null, 
                trangThai: { $in: ['DANG_MUON', 'QUA_HAN'] },
                ngayPhaiTra: { $lt: now } 
            }),
            Book.find().sort({ luotMuon: -1 }).limit(5).select('tenSach luotMuon tacGia hinhAnh'),
            Publisher.aggregate([
                {
                    $lookup: {
                        from: 'books',
                        localField: '_id',
                        foreignField: 'nhaXuatBan',
                        as: 'books'
                    }
                },
                {
                    $project: {
                        tenNXB: 1,
                        bookCount: { $size: '$books' }
                    }
                }
            ])
        ]);

        // Monthly trends for the last 6 months
        const monthLabels = [];
        const monthlyCounts = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const m = d.getMonth() + 1;
            const y = d.getFullYear();
            const label = `Thg ${m}/${y}`;
            monthLabels.push(label);

            const startOfMonth = new Date(y, m - 1, 1);
            const endOfMonth = new Date(y, m, 0, 23, 59, 59);

            const count = await Borrow.countDocuments({
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
            });
            monthlyCounts.push(count);
        }

        res.status(200).json({
            success: true,
            data: {
                totalBooks,
                totalReaders,
                totalBorrows,
                unreturnedBorrows,
                pendingBorrows,
                overdueBorrows,
                topBooks,
                publishers,
                monthlyTrends: {
                    labels: monthLabels,
                    counts: monthlyCounts
                }
            }
        });
    } catch (error) {
        next(error);
    }
};