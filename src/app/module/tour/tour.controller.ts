import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { tourServices } from "./tour.services";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


// Tour type related controllers
const createTourType = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const tourType = await tourServices.createTourType(payload);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Tour type created successfully",
        data: tourType,
    })
})


const getTourTypes = catchAsync(async (req: Request, res: Response) => {

    const tourTypes = await tourServices.getTourTypes();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Tour types retrieved successfully",
        data: tourTypes,

    })
})


const updateTourTypes = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;
    const payload = req.body

    const updatedTourTypes = await tourServices.updateTourTypes(id, payload)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "tour types updated successfully",
        data: updatedTourTypes,
    })
})


const deleteTourTypes = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;

    const data = await tourServices.deleteTourTypes(id)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Tour deleted successfully",
        data: data,
    })
})


// Tour related controllers
const createTour = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const tour = await tourServices.createTour(payload);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Tour  created successfully",
        data: tour,
    })
})

const getTours = catchAsync(async (req: Request, res: Response) => {

    const query = req.query;

    const data = await tourServices.getTours(query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Tours retrieved successfully",
        data: data.data,
        meta: data.meta

    })
})


const updateTour = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;
    const payload = req.body

    const updatedTour = await tourServices.updateTour(id, payload)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "tour updated successfully",
        data: updatedTour,
    })
})


export const tourController = {
    createTourType,
    getTourTypes,
    updateTourTypes,
    deleteTourTypes,

    createTour,
    getTours,
    updateTour,
}