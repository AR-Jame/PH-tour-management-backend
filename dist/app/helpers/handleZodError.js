"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (err) => {
    const errorSources = [];
    JSON.parse(err.message).forEach((single) => {
        errorSources.push({
            // path: single.path[single.path.length - 1],
            path: single.path.length > 1 ? single.path.reverse().join(" inside ") : single.path[single.path.length - 1],
            message: single.message
        });
    });
    return {
        statusCode: 400,
        message: "Zod error",
        errorSources
    };
};
exports.handleZodError = handleZodError;
