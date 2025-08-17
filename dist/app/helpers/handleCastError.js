"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const http_status_codes_1 = require("http-status-codes");
const handleCastError = (err) => {
    return {
        statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        message: "Your objectId is't valid. Provide a valid objectId"
    };
};
exports.handleCastError = handleCastError;
