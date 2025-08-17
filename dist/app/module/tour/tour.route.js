"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tour_controller_1 = require("./tour.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validationRequest_1 = require("../../middlewares/validationRequest");
const tour_validation_1 = require("./tour.validation");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
//Tour type related routes 
router.post('/create-tour-type', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validationRequest_1.zodValidation)(tour_validation_1.createTourTypeZodSchema), tour_controller_1.tourController.createTourType);
router.get('/tour-types', tour_controller_1.tourController.getTourTypes);
router.patch('/tour-types/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validationRequest_1.zodValidation)(tour_validation_1.updateTourTypeZodSchema), tour_controller_1.tourController.updateTourTypes);
router.delete('/tour-types/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.tourController.deleteTourTypes);
// Tour related routes
router.post('/create', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array('files'), (0, validationRequest_1.zodValidation)(tour_validation_1.createTourZodSchema), tour_controller_1.tourController.createTour);
router.get('/', tour_controller_1.tourController.getTours);
router.patch('/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array('files'), (0, validationRequest_1.zodValidation)(tour_validation_1.updateTourZodSchema), tour_controller_1.tourController.updateTour);
exports.tourRoutes = router;
