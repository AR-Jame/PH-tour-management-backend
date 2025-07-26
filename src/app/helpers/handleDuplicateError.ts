/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes"
import { TErrorResponse } from "../interfaces/error.types"

export const handleDuplicateError = (err: any): TErrorResponse => {
    const matchedArr = err.message.match(/"([^"]*)"/)
    return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: matchedArr[1] + " already exists."
    }
}