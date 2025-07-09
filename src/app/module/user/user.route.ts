import express from 'express';
import { userControllers } from './user.controller';
const router = express.Router();


router.post('/register', userControllers.createUser);

export const UserRoutes = router;
