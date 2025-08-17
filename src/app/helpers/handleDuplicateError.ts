/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes"
import { TErrorResponse } from "../interfaces/error.types"

export const handleDuplicateError = (err: any): TErrorResponse => {
    // const matchedArr = err.message.match(/"([^"]*)"/);
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `${field} ${value} already exists.`
    }
}