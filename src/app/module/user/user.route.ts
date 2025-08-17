import express from 'express';
import { userControllers } from './user.controller';
import { createUserZodSchema, updateUserZodSchema } from './user.validation';
import { zodValidation } from '../../middlewares/validationRequest';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from './user.interface';

const router = express.Router();

router.post('/register',
    zodValidation(createUserZodSchema),
    userControllers.createUser
);
router.get('/me',
    checkAuth(...Object.values(Role)),
    userControllers.getMe
)
router.get('/all-user', checkAuth('ADMIN', 'SUPER_ADMIN'), userControllers.getAllUser);

router.get('/:userId',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    userControllers.getSingleUser
)
router.patch('/:id', zodValidation(updateUserZodSchema), checkAuth(...Object.values(Role)), userControllers.updateUser)

export const UserRoutes = router;
