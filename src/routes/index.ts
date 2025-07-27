import { Router } from 'express';
import { UserRoutes } from '../app/module/user/user.route';
import { authRouter } from '../app/module/auth/auth.route';
import { divisionRoutes } from '../app/module/division/division.route';


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
    }
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})