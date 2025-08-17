"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const env_1 = require("../config/env");
const checkAuth = (...authRoles) => (req, res, next) => {
    // const accessToken = req.headers.authorization;
    const accessToken = req.headers.authorization;
    if (!accessToken) {
        throw new AppError_1.default(403, 'You get an 403 error');
    }
    const verifyToken = jsonwebtoken_1.default.verify(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
    req.user = verifyToken;
    if (!authRoles.includes(verifyToken.role)) {
        throw new AppError_1.default(401, "You get an 401 error");
    }
    next();
};
exports.checkAuth = checkAuth;
