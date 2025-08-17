"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validationRequest_1 = require("../../middlewares/validationRequest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const router = express_1.default.Router();
router.post('/register', (0, validationRequest_1.zodValidation)(user_validation_1.createUserZodSchema), user_controller_1.userControllers.createUser);
router.get('/me', (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.userControllers.getMe);
router.get('/all-user', (0, checkAuth_1.checkAuth)('ADMIN', 'SUPER_ADMIN'), user_controller_1.userControllers.getAllUser);
router.get('/:userId', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.getSingleUser);
router.patch('/:id', (0, validationRequest_1.zodValidation)(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.userControllers.updateUser);
exports.UserRoutes = router;
