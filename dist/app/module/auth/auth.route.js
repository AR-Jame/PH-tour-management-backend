"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.authControllers.credentialsLogin);
router.post('/refresh-token', auth_controller_1.authControllers.getNewAccessToken);
router.post('/logout', auth_controller_1.authControllers.logout);
router.post('/change-password', (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authControllers.changePassword);
router.get('/set-password', (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authControllers.setPassword);
router.post('/forgot-password', auth_controller_1.authControllers.forgotPassword);
router.post('/reset-password', (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authControllers.resetPassword);
router.get('/google', (req, res, next) => {
    var _a;
    const redirect = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.redirect) || "/";
    passport_1.default.authenticate('google', { scope: ["profile", "email"], state: redirect })(req, res, next);
});
router.get('/google/callback', passport_1.default.authenticate("google", { failureRedirect: `${env_1.envVars.FRONTEND_URL}/login?error=There is some issue with your account. Please contact with our support team.` }), auth_controller_1.authControllers.googleCallback);
exports.authRouter = router;
