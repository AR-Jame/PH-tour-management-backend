import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes'
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async (req: Request, res: Response) => {

    const user = await userServices.createUser(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        data: user,
        message: "User created Successfully",
        success: true
    })

})
const updateUser = catchAsync(async (req: Request, res: Response) => {

    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;

    const user = await userServices.updateUser(userId, payload, verifiedToken as JwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        data: user,
        message: "User Updated Successfully",
        success: true
    })

})

const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const users = await userServices.getAllUser();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All Users retrieved Successfully',
        data: users
    })
})

export const userControllers = {
    createUser,
    updateUser,
    getAllUser,
}


// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {

//         const user = await userServices.createUser(req.body);

//         res.status(StatusCodes.CREATED).send({
//             message: 'User created successfully.',
//             user
//         })

//     } catch (error: any) {
//         next(error)
//     }
// }

// const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const users = await userServices.getAllUser();
//         res
//             .status(StatusCodes.OK)
//             .send(users)
//     } catch (error) {
//         next(error)
//     }
// }