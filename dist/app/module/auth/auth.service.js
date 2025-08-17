"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = require("http-status-codes");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const userPurify_1 = require("../../utils/userPurify");
const user_interface_1 = require("../user/user.interface");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../../utils/sendEmail");
// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;
//     const isUserExist = await User.findOne({ email });
//     if (!isUserExist) {
//         throw new AppError(StatusCodes.BAD_REQUEST, "Email Does not exist")
//     }
//     const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)
//     if (!isPasswordMatch) {
//         throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect Password")
//     }
//     const userTokenData = {
//         _id: isUserExist._id,
//         email: isUserExist.email,
//         role: isUserExist.role,
//     }
//     const { accessToken, refreshToken } = createUserTokens(userTokenData)
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: passcode, ...rest } = isUserExist.toObject(); // for remove mongoose specific fields.
//     return {
//         accessToken,
//         refreshToken,
//         user: rest
//     }
// };
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
    const isUserExist = yield (0, userPurify_1.userPurify)(verifiedRefreshToken);
    const userTokenData = {
        _id: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = (0, jwt_1.generateToken)(userTokenData, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    return {
        accessToken
    };
});
const changePassword = (decodedToken, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield (0, userPurify_1.userPurify)(decodedToken);
    const isOldPasswordMatched = yield bcryptjs_1.default.compare(oldPassword, isUserExist.password);
    if (!isOldPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Old password doesn't matched.");
    }
    ;
    const newHashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    yield user_model_1.User.findOneAndUpdate({ _id: isUserExist._id }, { password: newHashedPassword });
    return true;
});
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.password || user.auths.some(providerId => providerId.provider === "credentials")) {
        throw new AppError_1.default(400, "You've already set your password. Now you can change it from you profile");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authArray = [...user.auths, { provider: "credentials", providerId: user.email }];
    user.password = hashedPassword;
    user.auths = authArray;
    yield user.save();
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id != token.userId) {
        throw new AppError_1.default(401, "You can't change this password");
    }
    const isUserExist = yield user_model_1.User.findById(payload.id);
    if (!isUserExist) {
        throw new AppError_1.default(401, "You can't change this password");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    isUserExist.password = hashedPassword;
    yield isUserExist.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(404, "User does not exist.");
    }
    if (!user.isVerified) {
        throw new AppError_1.default(401, "User does verified.");
    }
    if (user.isActive !== user_interface_1.IsActive.ACTIVE) {
        throw new AppError_1.default(401, `User is ${user.isActive}`);
    }
    if (user.isDeleted === true) {
        throw new AppError_1.default(401, "User is deleted.");
    }
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, { expiresIn: "10m" });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)({
        to: user.email,
        subject: "Password reset email",
        templateName: "forgetPassword",
        templateData: {
            name: user.name,
            resetUILink
        }
    });
});
exports.AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword
};
