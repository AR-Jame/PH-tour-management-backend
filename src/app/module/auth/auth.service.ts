import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import bcryptjs from 'bcryptjs';
import { createUserTokens } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { userPurify } from "../../utils/userPurify";

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

    const userTokenData = {
        _id: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,

    }

    const { accessToken, refreshToken } = createUserTokens(userTokenData)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: passcode, ...rest } = isUserExist.toObject(); // for remove mongoose specific fields.
    return {
        accessToken,
        refreshToken,
        user: rest
    }

};


const getNewAccessToken = async (refreshToken: string) => {

    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExist = await userPurify(verifiedRefreshToken);

    const userTokenData = {
        _id: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    }

    const accessToken = generateToken(userTokenData, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return {
        accessToken
    }

};

const resetPassword = async (decodedToken: JwtPayload, oldPassword: string, newPassword: string) => {

    const isUserExist = await userPurify(decodedToken);

    const isOldPasswordMatched = await bcryptjs.compare(oldPassword, isUserExist.password as string)

    if (!isOldPasswordMatched) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Old password doesn't matched.")
    };

    const newHashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

    await User.findOneAndUpdate({ _id: isUserExist._id }, { password: newHashedPassword })

    return true;

}


export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}