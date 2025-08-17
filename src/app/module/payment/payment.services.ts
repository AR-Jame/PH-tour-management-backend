/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelper/AppError";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model"
import { ISSLCommrez } from "../sslCommerz/sslCommerz.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.services";
import { IUser } from "../user/user.interface";
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

        const updatedBooking = await Booking.findByIdAndUpdate(
            payment?.booking,
            { status: BOOKING_STATUS.COMPLETE },
            { runValidators: true, new: true, session }
        ).populate("user", "name email")

        const invoiceData: IInvoiceData = {
            bookingDate: updatedBooking?.createdAt as Date,
            customerName: (updatedBooking?.user as unknown as IUser).name as string,
            transactionId: payment?.transactionId as string
        }

        const pdfBuffer = await generatePdf(invoiceData);

        await sendEmail({
            to: (updatedBooking?.user as unknown as IUser).email as string,
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
        })

        const cloudinaryResult: any = await uploadBufferToCloudinary(pdfBuffer, "invoice");

        await Payment.findByIdAndUpdate(payment?._id, { invoice_Url: cloudinaryResult.secure_url }, { session })

        console.log(cloudinaryResult);

        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Payment completed successfully." }

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
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

const getInvoiceUrl = async (paymentId: string) => {
    const invoiceUrl = await Payment.findById(paymentId)
        .select("invoice_Url")
        .orFail(new Error("Payment does not found."));

    if (!invoiceUrl.invoice_Url) {
        throw new AppError(401, "Download URL does not found.")
    }

    return invoiceUrl.invoice_Url;
}

export const paymentServices = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceUrl
}