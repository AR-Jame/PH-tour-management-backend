/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose"
import { TErrorResponse } from "../interfaces/error.types"
import { StatusCodes } from "http-status-codes"

export const handleCastError = (err: mongoose.Error.CastError): TErrorResponse => {
    return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Your objectId is't valid. Provide a valid objectId"
    }
}