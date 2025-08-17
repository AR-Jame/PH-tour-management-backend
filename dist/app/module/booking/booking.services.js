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
exports.bookingServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const getTransactionId_1 = require("../../utils/getTransactionId");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_services_1 = require("../sslCommerz/sslCommerz.services");
const tour_model_1 = require("../tour/tour.model");
const booking_interface_1 = require("./booking.interface");
const booking_model_1 = require("./booking.model");
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        // const user = await User.findById(userId);
        // if (!user?.phone || !user.address) {
        //     throw new AppError(400, "please add a phone and address in your profile")
        // }
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("costForm");
        const booking = yield booking_model_1.Booking.create([Object.assign({ user: userId, status: booking_interface_1.BOOKING_STATUS.PENDING }, payload)], { session });
        const amount = Number(tour === null || tour === void 0 ? void 0 : tour.costForm) * Number(payload.guestCount);
        const transactionId = (0, getTransactionId_1.generateTransactionId)();
        const payment = yield payment_model_1.Payment.create([{
                booking: booking[0]._id,
                transactionId: transactionId,
                amount: amount,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID
            }], { session });
        const updatedBooking = yield booking_model_1.Booking
            .findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session })
            .populate('user', "name email phone address")
            .populate('tour', "title costForm")
            .populate("payment");
        const sslPayload = {
            name: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name,
            email: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email,
            phoneNumber: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).phoneNumber,
            transactionId,
            amount,
            address: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).address,
        };
        const sslPayment = yield sslCommerz_services_1.SSLServices.sslPaymentInit(sslPayload);
        yield session.commitTransaction();
        session.endSession();
        return {
            booking: updatedBooking,
            paymentUrl: sslPayment.GatewayPageURL
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.bookingServices = {
    createBooking
};
