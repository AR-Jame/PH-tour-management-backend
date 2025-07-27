import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {

    const isDivisionExist = await Division.findOne({ slug: payload.slug });

    if (isDivisionExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Division already exists.")
    }

    const slug = `${payload.name}-division`
    payload.slug = slug

    const division = await Division.create(payload);
    return division

}

const getDivision = async () => {
    const divisions = await Division.find();
    return divisions
}


const updateDivision = async (id: string, payload: Partial<IDivision>) => {

    const isDivisionExist = await Division.findOne({ _id: id });

    if (!isDivisionExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Division does not exist.")
    }

    if (payload.name) {
        const updatedSlug = `${payload.name}-division`
        payload.slug = updatedSlug;
    }

    const updatedDivision = await Division.findOneAndUpdate({ _id: id }, payload, { new: true, runValidators: true })

    return updatedDivision
}

export const deleteDivision = async (id: string) => {

    const isDivisionExist = await Division.findOne({ _id: id });

    if (!isDivisionExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Division does not exist.")
    }

    // TODO: I have to implement the validation for tour
    // const isDivisionExistInTour = await

    await Division.deleteOne({ _id: id })
    return true;
}

export const divisionServices = {
    createDivision,
    getDivision,
    updateDivision,
    deleteDivision
}