/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PAID = "PAID",
    UNPAID = 'UNPAID',
    CANCELED = 'CANCELED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export interface IPayment {
    _id?: Types.ObjectId,
    booking: Types.ObjectId,
    transactionId: string,
    amount: number,
    paymentGateway?: any,
    invoice_Url?: string,
    status: PAYMENT_STATUS
}