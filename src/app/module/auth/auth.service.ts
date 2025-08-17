import AppError from "../../errorHelper/AppError";
import { User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import bcryptjs from 'bcryptjs';
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { userPurify } from "../../utils/userPurify";
import { IAuthProvider, IsActive } from "../user/user.interface";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

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

const changePassword = async (decodedToken: JwtPayload, oldPassword: string, newPassword: string) => {

    const isUserExist = await userPurify(decodedToken);

    const isOldPasswordMatched = await bcryptjs.compare(oldPassword, isUserExist.password as string)

    if (!isOldPasswordMatched) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Old password doesn't matched.")
    };

    const newHashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

    await User.findOneAndUpdate({ _id: isUserExist._id }, { password: newHashedPassword })

    return true;

}

const setPassword = async (userId: string, plainPassword: string) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (user.password || user.auths.some(providerId => providerId.provider === "credentials")) {
        throw new AppError(400, "You've already set your password. Now you can change it from you profile")
    }

    const hashedPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND));

    const authArray: IAuthProvider[] = [...user.auths, { provider: "credentials", providerId: user.email }]

    user.password = hashedPassword;
    user.auths = authArray;

    await user.save()
}

const resetPassword = async (payload: Record<string, string>, token: JwtPayload) => {
    if (payload.id != token.userId) {
        throw new AppError(401, "You can't change this password")
    }

    const isUserExist = await User.findById(payload.id);

    if (!isUserExist) {
        throw new AppError(401, "You can't change this password")
    }
    const hashedPassword = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))

    isUserExist.password = hashedPassword;
    await isUserExist.save();
}

const forgotPassword = async (email: string) => {

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new AppError(404, "User does not exist.")
    }

    if (!user.isVerified) {
        throw new AppError(401, "User does verified.")
    }

    if (user.isActive !== IsActive.ACTIVE) {
        throw new AppError(401, `User is ${user.isActive}`)
    }

    if (user.isDeleted === true) {
        throw new AppError(401, "User is deleted.")
    }

    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };

    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, { expiresIn: "10m" })
    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`

    sendEmail({
        to: user.email,
        subject: "Password reset email",
        templateName: "forgetPassword",
        templateData: {
            name: user.name,
            resetUILink
        }
    })

}


export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword
}