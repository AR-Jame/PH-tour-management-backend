/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelper/AppError";
import { TErrorSources } from "../interfaces/error.types";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";


export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500
    let message = `something went wrong!`;
    let errorSources: TErrorSources[] = [];

    if (req.file) {
        await deleteImageFromCloudinary(req.file.path);
    }

    if (req.files && req.files.length) {
        const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)

        await Promise.all(imageUrls.map(url => deleteImageFromCloudinary(url)))
    }

    // mongoose validation err
    if (err.code === 11000) {
        const simplifiedErr = handleDuplicateError(err);
        statusCode = simplifiedErr.statusCode;
        message = simplifiedErr.message
    }
    else if (err.name === "CastError") {
        const simplifiedErr = handleCastError(err);
        statusCode = simplifiedErr.statusCode;
        message = simplifiedErr.message;
    }
    else if (err.name === 'ValidationError') {
        const simplifiedErr = handleValidationError(err);
        statusCode = simplifiedErr.statusCode;
        message = simplifiedErr.message;
        errorSources = simplifiedErr.errorSources as TErrorSources[]

    }

    // ZodError
    else if (err.name === "ZodError") {
        const simplifiedErr = handleZodError(err);
        statusCode = simplifiedErr.statusCode;
        message = simplifiedErr.message;
        errorSources = simplifiedErr.errorSources

    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorSources,
        err: envVars.NODE_ENV === 'development' ? err.err : null,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}