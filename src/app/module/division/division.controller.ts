import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { divisionServices } from "./division.services";
import AppError from "../../errorHelper/AppError";
import { IDivision } from "./division.interface";

const createDivision = catchAsync(async (req: Request, res: Response) => {

    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const division = await divisionServices.createDivision(payload);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "division created successfully",
        data: division,
    })
})
const getDivision = catchAsync(async (req: Request, res: Response) => {

    const data = await divisionServices.getDivision();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "division retrieved successfully",
        data: data.data,
        // meta: data.meta

    })
})
const getSingleDivision = catchAsync(async (req: Request, res: Response) => {

    const slug = req.params.slug;
    if (!slug) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Slug does not found")
    }
    const data = await divisionServices.getSingleDivision(slug);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "division retrieved successfully",
        data: data

    })
})

const updateDivision = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }

    const updatedDivision = await divisionServices.updateDivision(id, payload)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "division updated successfully",
        data: updatedDivision,
    })
})
const deleteDivision = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;

    const data = await divisionServices.deleteDivision(id)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "division deleted successfully",
        data: data,
    })
})

export const divisionController = {
    createDivision,
    getDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision
}