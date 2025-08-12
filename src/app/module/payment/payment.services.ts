/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelper/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model"
import { ISSLCommrez } from "../sslCommerz/sslCommerz.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.services";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();


    try {

        const payment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.PAID },
            { runValidators: true, session }
        )

        await Booking.findByIdAndUpdate(
            payment?.booking,
            { status: BOOKING_STATUS.COMPLETE },
            { runValidators: true, session }
        )

        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Payment completed successfully." }

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }
}

const failPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {

        const payment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.FAILED },
            { runValidators: true, session }
        )

        await Booking.findByIdAndUpdate(
            payment?.booking,
            { status: BOOKING_STATUS.FAILED },
            { runValidators: true, session }
        )

        await session.commitTransaction();
        session.endSession();

        return { success: false, message: "Payment failed." }

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }
}

const cancelPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();
    try {

        const payment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.CANCELED },
            { runValidators: true, session }
        )

        await Booking.findByIdAndUpdate(
            payment?.booking,
            { status: BOOKING_STATUS.CANCEL },
            { runValidators: true, session }
        )

        await session.commitTransaction();
        session.endSession();

        return { success: false, message: "Payment canceled." }

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }
}


const initPayment = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId });

    if (!payment) {
        throw new AppError(400, "Booking does not initialized.")
    }

    const booking = await Booking.findById(bookingId);


    const sslPayload: ISSLCommrez = {
        name: (booking?.user as any).name,
        email: (booking?.user as any).email,
        phoneNumber: (booking?.user as any).phoneNumber,
        amount: payment.amount,
        transactionId: payment.transactionId,
        address: (booking?.user as any).address,
    }

    const sslPayment = await SSLServices.sslPaymentInit(sslPayload);

    return { paymentUrl: sslPayment.GatewayPageURL }
}

export const paymentServices = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
}