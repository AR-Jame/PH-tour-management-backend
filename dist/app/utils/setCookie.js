"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_1 = require("../config/env");
const setAuthCookie = (res, cookieInfo) => {
    if (cookieInfo.accessToken) {
        res.cookie("accessToken", cookieInfo.accessToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
    if (cookieInfo.refreshToken) {
        res.cookie("refreshToken", cookieInfo.refreshToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
};
exports.setAuthCookie = setAuthCookie;
