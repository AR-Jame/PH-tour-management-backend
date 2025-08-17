import { Response } from "express";
import { envVars } from "../config/env";

interface ICookieInfo {
    accessToken?: string
    refreshToken?: string
}

export const setAuthCookie = (res: Response, cookieInfo: ICookieInfo) => {

    if (cookieInfo.accessToken) {
        res.cookie("accessToken", cookieInfo.accessToken, {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
    if (cookieInfo.refreshToken) {
        res.cookie("refreshToken", cookieInfo.refreshToken, {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }

}