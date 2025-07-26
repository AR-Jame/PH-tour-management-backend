/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose"
import { TErrorResponse, TErrorSources } from "../interfaces/error.types"
import { StatusCodes } from "http-status-codes"

export const handleValidationError = (err: mongoose.Error.ValidationError): TErrorResponse => {

    const errorSources: TErrorSources[] = [];
    const errors = Object.values(err.errors);

    errors.forEach((single: any) => errorSources.push({
        path: single.path,
        message: single.message
    }))

    return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Validation Error",
        errorSources,

    }

}