"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsServices = void 0;
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.BLOCKED });
    const totalInActiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE });
    const newUserInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const newUserInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const usersByRolesPromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalUsers, totalActiveUsers, totalBlockedUsers, totalInActiveUsers, newUserInLast7Days, newUserInLast30Days, usersByRoles,] = yield Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalBlockedUsersPromise,
        totalInActiveUsersPromise,
        newUserInLast7DaysPromise,
        newUserInLast30DaysPromise,
        usersByRolesPromise
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalBlockedUsers,
        totalInActiveUsers,
        newUserInLast7Days,
        newUserInLast30Days,
        usersByRoles,
    };
});
const getTourStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTourPromise = tour_model_1.Tour.countDocuments();
    const totalTourByTourTypePromise = tour_model_1.Tour.aggregate([
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type"
            }
        },
        {
            $unwind: "$type"
        },
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 }
            }
        }
    ]);
    const avgTourCostPromise = tour_model_1.Tour.aggregate([
        {
            $group: {
                _id: null,
                avgCostFrom: { $avg: "$costForm" }
            }
        }
    ]);
    const totalTourByDivisionPromise = tour_model_1.Tour.aggregate([
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division"
            }
        },
        {
            $unwind: "$division"
        },
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 }
            }
        }
    ]);
    const totalHighestBookedTourPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        {
            $sort: { bookingCount: -1 }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] }
                        }
                    }
                ],
                as: "tour"
            }
        },
        {
            $unwind: "$tour"
        },
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ]);
    const [totalTour, totalTourByTourType, avgTourCost, totalTourByDivision, totalHighestBookedTour] = yield Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        totalHighestBookedTourPromise
    ]);
    return {
        totalTour,
        totalTourByTourType,
        avgTourCost,
        totalTourByDivision,
        totalHighestBookedTour
    };
});
const getPaymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentByStatusPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);
    const totalRevenuePromise = payment_model_1.Payment.aggregate([
        {
            $match: {
                status: payment_interface_1.PAYMENT_STATUS.PAID,
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ]);
    const avgPaymentAmountPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: null,
                avgPaymentAmount: { $avg: "$amount" }
            }
        }
    ]);
    const paymentGatewayDataPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalPayment, totalRevenue, totalPaymentByStatus, avgPaymentAmount, paymentGatewayData,] = yield Promise.all([
        totalPaymentPromise,
        totalRevenuePromise,
        totalPaymentByStatusPromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise
    ]);
    return {
        totalPayment,
        totalRevenue: totalRevenue[0].totalRevenue,
        totalPaymentByStatus,
        avgPaymentAmount,
        paymentGatewayData,
    };
});
const getBookingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookingPromise = booking_model_1.Booking.countDocuments();
    const totalBookingByStatusPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);
    const totalBookingPerTourPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: '$tour',
                bookingCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },
        {
            $unwind: "$tour"
        },
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ]);
    const avgGuestCountPerBookingPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ]);
    const bookingLast7DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const bookingLast30DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const totalBookingByUniqueUsersPromise = booking_model_1.Booking.distinct("user");
    const [totalBooking, totalBookingByStatus, totalBookingPerTour, avgGuestCountPerBooking, bookingLast7Days, bookingLast30Days, totalBookingByUniqueUsers,] = yield Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        totalBookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingLast7DaysPromise,
        bookingLast30DaysPromise,
        totalBookingByUniqueUsersPromise,
    ]);
    return {
        totalBooking,
        totalBookingByStatus,
        totalBookingPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
        bookingLast7Days,
        bookingLast30Days,
        totalBookingByUniqueUsers,
    };
});
exports.statsServices = {
    getBookingStats,
    getUserStats,
    getPaymentStats,
    getTourStats
};
