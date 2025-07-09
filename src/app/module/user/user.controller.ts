/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes'
import { userServices } from "./user.service";


const createUser = async (req: Request, res: Response) => {
    try {

        const user = await userServices.createUser(req.body);

        res.status(StatusCodes.CREATED).send({
            message: 'User created successfully.',
            user
        })

    } catch (error: any) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({
            message: `Something went wrong@ ${error.message}`
        })
    }
}

export const userControllers = {
    createUser
}