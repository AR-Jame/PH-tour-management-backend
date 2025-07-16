import express from 'express';
import { userControllers } from './user.controller';
import { createUserZodSchema } from './user.validation';
import { zodValidation } from '../../middlewares/validationRequest';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router.post('/register', zodValidation(createUserZodSchema), userControllers.createUser);
router.get('/all-user', checkAuth('ADMIN', 'SUPER_ADMIN'), userControllers.getAllUser)

export const UserRoutes = router;
