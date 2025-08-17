import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { paymentServices } from "./payment.services";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import { SSLServices } from "../sslCommerz/sslCommerz.services";

const successPayment = catchAsync(async (req: Request, res: Response) => {

    const query = req.query;
    const result = await paymentServices.successPayment(query as Record<string, string>);
    console.log({ result, query: req.query });
    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query?.transactionId}&message=${result?.message}&amount=${query?.amount}&status=${query?.status}`);
    }
})
const failPayment = catchAsync(async (req: Request, res: Response) => {

    const query = req.query;
    const result = await paymentServices.failPayment(query as Record<string, string>);

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
})
const cancelPayment = catchAsync(async (req: Request, res: Response) => {

    const query = req.query;
    const result = await paymentServices.cancelPayment(query as Record<string, string>);

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
})

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await paymentServices.initPayment(bookingId)

    sendResponse(res, {
        statusCode: 201,
        message: 'Payment initialized successfully',
        success: true,
        data: result
    })
})


const getInvoiceUrl = catchAsync(async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;
    const result = await paymentServices.getInvoiceUrl(paymentId)

    sendResponse(res, {
        statusCode: 201,
        message: 'Invoice download URL retrieved successfully. ',
        success: true,
        data: result
    })
})


const validatePayment = catchAsync(async (req: Request, res: Response) => {
    await SSLServices.validatePayment(req.body);
    console.log(req.body);
    sendResponse(res, {
        statusCode: 201,
        message: 'Payment validated successfully successfully. ',
        success: true,
        data: null
    })
})

export const paymentControllers = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceUrl,
    validatePayment
}