import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { statsServices } from "./stats.services";

const getBookingStats = catchAsync(async (req: Request, res: Response) => {

    const data = await statsServices.getBookingStats()

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Booking stats retrieved successfully",
        data: data,
    })
})
const getPaymentStats = catchAsync(async (req: Request, res: Response) => {

    const data = await statsServices.getPaymentStats()

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Payment stats retrieved successfully",
        data: data,
    })
})
const getUserStats = catchAsync(async (req: Request, res: Response) => {

    const data = await statsServices.getUserStats()

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User stats retrieved successfully",
        data: data,
    })
})
const getTourStats = catchAsync(async (req: Request, res: Response) => {

    const data = await statsServices.getTourStats()

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Tour stats retrieved successfully",
        data: data,
    })
})

export const statsControllers = {
    getBookingStats,
    getPaymentStats,
    getTourStats,
    getUserStats
}