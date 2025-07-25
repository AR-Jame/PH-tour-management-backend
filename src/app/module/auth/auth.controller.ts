/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelper/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loggingInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, loggingInfo)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User Logged in successfully',
        data: loggingInfo
    })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(StatusCodes.BAD_REQUEST, "No refresh token found")
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'generate accessToken successfully',
        data: tokenInfo
    })
})


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Logout successfully.',
        data: {}
    })
})


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user;
    const newPassword = req.body?.newPassword;
    const oldPassword = req.body?.oldPassword;

    if (!newPassword || !oldPassword) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Password not found")
    }

    const resetPassword = await AuthServices.resetPassword(decodedToken as JwtPayload, oldPassword, newPassword);


    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Password changed successfully',
        data: {}
    })
})

const googleCallback = catchAsync(async (req: Request, res: Response) => {

    let redirectTo = req.query.state ? req.query.state as string : "";

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user;
    if (!user) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User data not found")
    }

    const tokenInfo = createUserTokens(user)

    console.log({ tokenInfo });

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})



export const authControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallback,
}