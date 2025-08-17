import { JwtPayload } from "jsonwebtoken";
import { User } from "../module/user/user.model";
import AppError from "../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { IsActive } from "../module/user/user.interface";

export const userPurify = async (verifiedToken: JwtPayload) => {
    const isUserExist = await User.findOne({ email: verifiedToken.email });


    if (!isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Email Does not exist")
    }

    if (isUserExist.isActive !== IsActive.ACTIVE) {
        throw new AppError(StatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted === true) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted")
    }

    return isUserExist
}