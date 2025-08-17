/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { generateTransactionId } from "../../utils/getTransactionId";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommrez } from "../sslCommerz/sslCommerz.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.services";
import { Tour } from "../tour/tour.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {

    const session = await Booking.startSession();
    session.startTransaction();

    try {

        // const user = await User.findById(userId);
        // if (!user?.phone || !user.address) {
        //     throw new AppError(400, "please add a phone and address in your profile")
        // }

        const tour = await Tour.findById(payload.tour).select("costForm");

        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
        }], { session });

        const amount = Number(tour?.costForm!) * Number(payload.guestCount!)
        const transactionId = generateTransactionId();

        const payment = await Payment.create([{
            booking: booking[0]._id,
            transactionId: transactionId,
            amount: amount,
            status: PAYMENT_STATUS.UNPAID
        }], { session })

        const updatedBooking = await Booking
            .findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session }
            )
            .populate('user', "name email phone address")
            .populate('tour', "title costForm")
            .populate("payment")



        const sslPayload: ISSLCommrez = {
            name: (updatedBooking?.user as any).name,
            email: (updatedBooking?.user as any).email,
            phoneNumber: (updatedBooking?.user as any).phoneNumber,
            transactionId,
            amount,
            address: (updatedBooking?.user as any).address,
        }

        const sslPayment = await SSLServices.sslPaymentInit(sslPayload);

        await session.commitTransaction()
        session.endSession();
        return {
            booking: updatedBooking,
            paymentUrl: sslPayment.GatewayPageURL
        }

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }


}

export const bookingServices = {
    createBooking
}