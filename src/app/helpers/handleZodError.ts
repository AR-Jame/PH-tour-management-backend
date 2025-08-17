/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources } from "../interfaces/error.types";

export const handleZodError = (err: any) => {
    const errorSources: TErrorSources[] = [];

    JSON.parse(err.message).forEach((single: any) => {
        errorSources.push({
            // path: single.path[single.path.length - 1],
            path: single.path.length > 1 ? single.path.reverse().join(" inside ") : single.path[single.path.length - 1],
            message: single.message
        })
    });

    return {
        statusCode: 400,
        message: "Zod error",
        errorSources
    }
}