import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();

const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);

const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);



const getUserStats = async () => {
    const totalUsersPromise = User.countDocuments();

    const totalActiveUsersPromise = User.countDocuments({ isActive: IsActive.ACTIVE });
    const totalBlockedUsersPromise = User.countDocuments({ isActive: IsActive.BLOCKED });
    const totalInActiveUsersPromise = User.countDocuments({ isActive: IsActive.INACTIVE });

    const newUserInLast7DaysPromise = User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })

    const newUserInLast30DaysPromise = User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })


    const usersByRolesPromise = User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])

    const [
        totalUsers,
        totalActiveUsers,
        totalBlockedUsers,
        totalInActiveUsers,
        newUserInLast7Days,
        newUserInLast30Days,
        usersByRoles,
    ] = await Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalBlockedUsersPromise,
        totalInActiveUsersPromise,
        newUserInLast7DaysPromise,
        newUserInLast30DaysPromise,
        usersByRolesPromise
    ])
    return {
        totalUsers,
        totalActiveUsers,
        totalBlockedUsers,
        totalInActiveUsers,
        newUserInLast7Days,
        newUserInLast30Days,
        usersByRoles,
    }
}
const getTourStats = async () => {
    const totalTourPromise = Tour.countDocuments();

    const totalTourByTourTypePromise = Tour.aggregate([
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
    ])

    const avgTourCostPromise = Tour.aggregate([
        {
            $group: {
                _id: null,
                avgCostFrom: { $avg: "$costForm" }
            }
        }
    ])

    const totalTourByDivisionPromise = Tour.aggregate([
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
    ])

    const totalHighestBookedTourPromise = Booking.aggregate([
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
    ])


    const [
        totalTour,
        totalTourByTourType,
        avgTourCost,
        totalTourByDivision,
        totalHighestBookedTour
    ] = await Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        totalHighestBookedTourPromise

    ])

    return {
        totalTour,
        totalTourByTourType,
        avgTourCost,
        totalTourByDivision,
        totalHighestBookedTour
    }
}
const getPaymentStats = async () => {

    const totalPaymentPromise = Payment.countDocuments();

    const totalPaymentByStatusPromise = Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    const totalRevenuePromise = Payment.aggregate([
        {
            $match: {
                status: PAYMENT_STATUS.PAID,
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ])

    const avgPaymentAmountPromise = Payment.aggregate([
        {
            $group: {
                _id: null,
                avgPaymentAmount: { $avg: "$amount" }
            }
        }
    ])

    const paymentGatewayDataPromise = Payment.aggregate([
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ])

    const [
        totalPayment,
        totalRevenue,
        totalPaymentByStatus,
        avgPaymentAmount,
        paymentGatewayData,
    ] = await Promise.all([
        totalPaymentPromise,
        totalRevenuePromise,
        totalPaymentByStatusPromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise
    ])

    return {
        totalPayment,
        totalRevenue: totalRevenue[0].totalRevenue,
        totalPaymentByStatus,
        avgPaymentAmount,
        paymentGatewayData,
    }
}
const getBookingStats = async () => {
    const totalBookingPromise = Booking.countDocuments();

    const totalBookingByStatusPromise = Booking.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const totalBookingPerTourPromise = Booking.aggregate([
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

    const avgGuestCountPerBookingPromise = Booking.aggregate([
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ])

    const bookingLast7DaysPromise = Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const bookingLast30DaysPromise = Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });

    const totalBookingByUniqueUsersPromise = Booking.distinct("user")

    const [
        totalBooking,
        totalBookingByStatus,
        totalBookingPerTour,
        avgGuestCountPerBooking,
        bookingLast7Days,
        bookingLast30Days,
        totalBookingByUniqueUsers,
    ] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        totalBookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingLast7DaysPromise,
        bookingLast30DaysPromise,
        totalBookingByUniqueUsersPromise,
    ])

    return {
        totalBooking,
        totalBookingByStatus,
        totalBookingPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
        bookingLast7Days,
        bookingLast30Days,
        totalBookingByUniqueUsers,
    }
}

export const statsServices = {
    getBookingStats,
    getUserStats,
    getPaymentStats,
    getTourStats
}