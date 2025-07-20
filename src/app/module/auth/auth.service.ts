import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import bcryptjs from 'bcryptjs';
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Email Does not exist")
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatch) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect Password")
    }

    const jwtPayload = {
        uerId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)


    return {
        accessToken
    }

}


export const AuthServices = {
    credentialsLogin
}