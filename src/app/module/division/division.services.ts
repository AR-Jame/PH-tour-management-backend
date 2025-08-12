import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import { Tour } from "../tour/tour.model";

const createDivision = async (payload: Partial<IDivision>) => {

    // const isDivisionExist = await Division.findOne({ name: payload.name });

    // if (isDivisionExist) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "Division already exists.")
    // }

    // const slug = `${payload.name}-division`
    // payload.slug = slug

    const division = await Division.create(payload);
    return division

}

const getDivision = async () => {
    const divisions = await Division.find();
    const totalDivision = await Division.countDocuments();

    return {
        data: divisions,
        meta: {
            total: totalDivision
        }
    }
}

const getSingleDivision = async (slug: string) => {
    const division = await Division.findOne({ slug });
    return division
}


const updateDivision = async (id: string, payload: Partial<IDivision>) => {

    // const isDivisionExist = await Division.findOne({ _id: id });

    // if (!isDivisionExist) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "Division does not exist.")
    // }

    // const duplicateDivision = await Division.findOne({
    //     name: payload.name,
    //     _id: { $ne: id }
    // })

    // if (duplicateDivision) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "A new division with this name already exist.")

    // }

    if (payload.name) {
        const baseSlug = payload.name?.toLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`


        let counter = 1;
        while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }

        payload.slug = slug
    }

    const updatedDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    if (!updatedDivision) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Division does not exist.");
    }

    return updatedDivision
}

export const deleteDivision = async (id: string) => {

    // const isDivisionExist = await Division.findOne({ _id: id });

    // if (!isDivisionExist) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "Division does not exist.")
    // }

    const isDivisionExistInTour = await Tour.find({ division: id });

    console.log(isDivisionExistInTour);

    // if (isDivisionExistInTour) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "This division exists in tour collection. Please handle this first.")
    // }

    await Division.deleteOne({ _id: id })
    return true;
}

export const divisionServices = {
    createDivision,
    getDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision,
}