import express from 'express'
import { tourController } from './tour.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { zodValidation } from '../../middlewares/validationRequest';
import { createTourTypeZodSchema, createTourZodSchema, updateTourTypeZodSchema, updateTourZodSchema } from './tour.validation';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

//Tour type related routes 

router.post('/create-tour-type',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    zodValidation(createTourTypeZodSchema),
    tourController.createTourType
)

router.get('/tour-types', tourController.getTourTypes);

router.patch('/tour-types/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    zodValidation(updateTourTypeZodSchema),
    tourController.updateTourTypes
);

router.delete('/tour-types/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    tourController.deleteTourTypes
);

// Tour related routes

router.post('/create',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array('files'),
    zodValidation(createTourZodSchema),
    tourController.createTour
)

router.get('/', tourController.getTours);

router.patch('/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array('files'),
    zodValidation(updateTourZodSchema),
    tourController.updateTour
);

export const tourRoutes = router