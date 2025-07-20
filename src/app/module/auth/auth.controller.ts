/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const Logging = await AuthServices.credentialsLogin(req.body);


    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User Logged in successfully',
        data: Logging
    })
})


export const authControllers = {
    credentialsLogin
}