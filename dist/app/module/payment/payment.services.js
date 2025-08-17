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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const sslCommerz_services_1 = require("../sslCommerz/sslCommerz.services");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.PAID }, { runValidators: true, session });
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.booking, { status: booking_interface_1.BOOKING_STATUS.COMPLETE }, { runValidators: true, new: true, session }).populate("user", "name email");
        const invoiceData = {
            bookingDate: updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.createdAt,
            customerName: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name,
            transactionId: payment === null || payment === void 0 ? void 0 : payment.transactionId
        };
        const pdfBuffer = yield (0, invoice_1.generatePdf)(invoiceData);
        yield (0, sendEmail_1.sendEmail)({
            to: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email,
            subject: "Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        });
        const cloudinaryResult = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, "invoice");
        yield payment_model_1.Payment.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment._id, { invoice_Url: cloudinaryResult.secure_url }, { session });
        console.log(cloudinaryResult);
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment completed successfully." };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.log(error);
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.FAILED }, { runValidators: true, session });
        yield booking_model_1.Booking.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.booking, { status: booking_interface_1.BOOKING_STATUS.FAILED }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment failed." };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.CANCELED }, { runValidators: true, session });
        yield booking_model_1.Booking.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.booking, { status: booking_interface_1.BOOKING_STATUS.CANCEL }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment canceled." };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(400, "Booking does not initialized.");
    }
    const booking = yield booking_model_1.Booking.findById(bookingId);
    const sslPayload = {
        name: (booking === null || booking === void 0 ? void 0 : booking.user).name,
        email: (booking === null || booking === void 0 ? void 0 : booking.user).email,
        phoneNumber: (booking === null || booking === void 0 ? void 0 : booking.user).phoneNumber,
        amount: payment.amount,
        transactionId: payment.transactionId,
        address: (booking === null || booking === void 0 ? void 0 : booking.user).address,
    };
    const sslPayment = yield sslCommerz_services_1.SSLServices.sslPaymentInit(sslPayload);
    return { paymentUrl: sslPayment.GatewayPageURL };
});
const getInvoiceUrl = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const invoiceUrl = yield payment_model_1.Payment.findById(paymentId)
        .select("invoice_Url")
        .orFail(new Error("Payment does not found."));
    if (!invoiceUrl.invoice_Url) {
        throw new AppError_1.default(401, "Download URL does not found.");
    }
    return invoiceUrl.invoice_Url;
});
exports.paymentServices = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceUrl
};
