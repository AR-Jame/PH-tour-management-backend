import { Router } from 'express';
import { UserRoutes } from '../app/module/user/user.route';
import { authRouter } from '../app/module/auth/auth.route';


export const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: authRouter
    }
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})