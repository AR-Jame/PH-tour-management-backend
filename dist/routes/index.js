"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../app/module/user/user.route");
const auth_route_1 = require("../app/module/auth/auth.route");
const division_route_1 = require("../app/module/division/division.route");
const tour_route_1 = require("../app/module/tour/tour.route");
const bookin_route_1 = require("../app/module/booking/bookin.route");
const payment_route_1 = require("../app/module/payment/payment.route");
const otp_route_1 = require("../app/module/otp/otp.route");
const stats_route_1 = require("../app/module/stats/stats.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoutes
    },
    {
        path: '/auth',
        route: auth_route_1.authRouter
    },
    {
        path: '/division',
        route: division_route_1.divisionRoutes
    },
    {
        path: '/tour',
        route: tour_route_1.tourRoutes
    },
    {
        path: '/booking',
        route: bookin_route_1.bookingRoutes
    },
    {
        path: '/payment',
        route: payment_route_1.paymentRoutes
    },
    {
        path: '/otp',
        route: otp_route_1.OTPRoutes
    },
    {
        path: '/stats',
        route: stats_route_1.statsRoutes
    },
];
moduleRoutes.forEach(route => {
    exports.router.use(route.path, route.route);
});
