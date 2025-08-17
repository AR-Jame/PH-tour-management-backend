"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = require("http-status-codes");
const handleDuplicateError = (err) => {
    // const matchedArr = err.message.match(/"([^"]*)"/);
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return {
        statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        message: `${field} ${value} already exists.`
    };
};
exports.handleDuplicateError = handleDuplicateError;
