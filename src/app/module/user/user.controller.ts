/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes'
import { userServices } from "./user.service";


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await userServices.createUser(req.body);

        res.status(StatusCodes.CREATED).send({
            message: 'User created successfully.',
            user
        })

    } catch (error: any) {
        next(error)
    }
}

export const userControllers = {
    createUser
}