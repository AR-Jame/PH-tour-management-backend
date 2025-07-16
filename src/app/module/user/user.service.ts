import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import StatusCodes from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { envVars } from "../../config/env";

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

const getAllUser = async () => {
    const users = await User.find({});
    return users
}



export const userServices = {
    createUser,
    getAllUser
}