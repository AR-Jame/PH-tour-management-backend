"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const http_status_codes_1 = require("http-status-codes");
const handleValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((single) => errorSources.push({
        path: single.path,
        message: single.message
    }));
    return {
        statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        message: "Validation Error",
        errorSources,
    };
};
exports.handleValidationError = handleValidationError;
