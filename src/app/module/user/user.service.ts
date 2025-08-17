import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import StatusCodes from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email: email });

    if (isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Email already exists.")
    }

    const hashedPassword = await bcryptjs.hash(password as string, parseInt(envVars.BCRYPT_SALT_ROUND));

    const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: email as string
    }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });
    return user
}

const getSingleUser = async (userId: string) => {
    const user = await User.findById(userId).select('-password')
    return user
}

const getMe = async (userId: string) => {

    const user = await User.findById(userId).select('-password');

    return user
}
const getAllUser = async () => {
    const users = await User.find({});
    return users
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById({ _id: userId })

    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {

        if (userId !== decodedToken.userId) {
            throw new AppError(401, "You are not authorized.")
        }
    }

    if (decodedToken.role === Role.ADMIN && ifUserExist?.role === Role.SUPER_ADMIN) {
        throw new AppError(401, "You are not authorized.")
    }

    if (!ifUserExist) {
        throw new AppError(StatusCodes.NOT_FOUND, "User does not exist");
    }


    if (payload.role) {

        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
        };

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
        };
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser

}

export const userServices = {
    createUser,
    getAllUser,
    updateUser,
    getMe,
    getSingleUser
}