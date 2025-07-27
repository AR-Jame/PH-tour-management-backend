import express from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { zodValidation } from "../../middlewares/validationRequest";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";

const router = express.Router()

router.post('/create',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    zodValidation(createDivisionZodSchema),
    divisionController.createDivision
);

router.get('/', divisionController.getDivision);

router.patch('/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    zodValidation(updateDivisionZodSchema),
    divisionController.updateDivision
);

router.delete('/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    divisionController.deleteDivision
);

export const divisionRoutes = router;