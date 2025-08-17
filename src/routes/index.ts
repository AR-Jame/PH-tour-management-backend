import { Router } from 'express';
import { UserRoutes } from '../app/module/user/user.route';
import { authRouter } from '../app/module/auth/auth.route';
import { divisionRoutes } from '../app/module/division/division.route';
import { tourRoutes } from '../app/module/tour/tour.route';
import { bookingRoutes } from '../app/module/booking/bookin.route';
import { paymentRoutes } from '../app/module/payment/payment.route';
import { OTPRoutes } from '../app/module/otp/otp.route';
import { statsRoutes } from '../app/module/stats/stats.route';


export const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/division',
        route: divisionRoutes
    },
    {
        path: '/tour',
        route: tourRoutes
    },
    {
        path: '/booking',
        route: bookingRoutes
    },
    {
        path: '/payment',
        route: paymentRoutes
    },
    {
        path: '/otp',
        route: OTPRoutes
    },
    {
        path: '/stats',
        route: statsRoutes
    },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})