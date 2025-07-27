import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { divisionServices } from "./division.services";

const createDivision = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body

    const tourData = await divisionServices.createDivision(payload);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "division created successfully",
        data: tourData,

    })
})
const getDivision = catchAsync(async (req: Request, res: Response) => {

    const divisions = await divisionServices.getDivision();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "division retrieved successfully",
        data: divisions,

    })
})

const updateDivision = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;
    const payload = req.body

    const updatedDivision = await divisionServices.updateDivision(id, payload)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "division updated successfully successfully",
        data: updatedDivision,
    })
})
const deleteDivision = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;

    const data = await divisionServices.deleteDivision(id)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "division updated successfully successfully",
        data: data,
    })
})

export const divisionController = {
    createDivision,
    getDivision,
    updateDivision,
    deleteDivision
}