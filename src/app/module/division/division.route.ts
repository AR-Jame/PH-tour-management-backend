import express from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { zodValidation } from "../../middlewares/validationRequest";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { multerUpload } from "../../config/multer.config";

const router = express.Router()

router.post('/create',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    zodValidation(createDivisionZodSchema),
    divisionController.createDivision
);

router.get('/', divisionController.getDivision);

router.get('/:slug', divisionController.getSingleDivision)


router.patch('/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single('file'),
    zodValidation(updateDivisionZodSchema),
    divisionController.updateDivision
);

router.delete('/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    divisionController.deleteDivision
);

export const divisionRoutes = router;