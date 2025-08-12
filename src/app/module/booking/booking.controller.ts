import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingServices } from "./booking.services";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body;
    const decodedToken = req.user as JwtPayload;
    const booking = await bookingServices.createBooking(payload, decodedToken.id)
    sendResponse(res, {
        statusCode: 201,
        message: 'Booking created successfully',
        success: true,
        data: booking
    })
})
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: 201,
        message: 'Booking created successfully',
        success: true,
        data: {}
    })
})
const getUserBookings = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: 201,
        message: 'Booking created successfully',
        success: true,
        data: {}
    })
})
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: 201,
        message: 'Booking created successfully',
        success: true,
        data: {}
    })
})
const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: 201,
        message: 'Booking created successfully',
        success: true,
        data: {}
    })
})


export const bookingControllers = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getSingleBooking,
    updateBookingStatus
}