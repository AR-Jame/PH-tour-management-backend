import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import AppError from "../errorHelper/AppError";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        throw new AppError(403, 'You get an 403 error')
    }

    const verifyToken = jwt.verify(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

    if (!authRoles.includes(verifyToken.role)) {
        throw new AppError(401, "You get an 401 error")
    }
    next()

}