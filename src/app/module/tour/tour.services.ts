import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { ITour, ITourType } from "./tour.interface"
import { Tour, TourType } from "./tour.model"
import { Division } from "../division/division.model";
import { User } from "../user/user.model";
import { tourSearchableFields } from "./tour.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createTourType = async (payload: Partial<ITourType>) => {
    const tourType = await TourType.create(payload);
    return tourType
}

const getTourTypes = async () => {
    const tourTypes = await TourType.find();
    return tourTypes
}


const updateTourTypes = async (id: string, payload: Partial<ITourType>) => {

    const updatedTourTypes = await TourType.findOneAndUpdate({ _id: id }, payload, { new: true, runValidators: true })

    if (!updateTour) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Tour type does not exist.")
    }

    return updatedTourTypes
}


export const deleteTourTypes = async (id: string) => {

    const isTourTypesExist = await TourType.findOne({ _id: id });

    if (!isTourTypesExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Tour types does not exist.")
    }

    const isTourTypesExistInTour = await Tour.find({ tourType: id });

    if (isTourTypesExistInTour) {
        throw new AppError(StatusCodes.BAD_REQUEST, "This tour type exists in tour collection. Please handle this first.")
    }

    await TourType.deleteOne({ _id: id })
    return true;
}


// Tour related services

const createTour = async (payload: Partial<ITour>) => {

    const isTourExistInTourType = await TourType.findById(payload.tourType);
    if (!isTourExistInTourType) {
        throw new AppError(StatusCodes.BAD_REQUEST, "This tour type does not exist.")
    }

    const isTourExistInDivision = await Division.findById(payload.division);
    if (!isTourExistInDivision) {
        throw new AppError(StatusCodes.BAD_REQUEST, "This division does not exist.")
    }

    const tour = await Tour.create(payload);
    return tour
}

const getTours = async (query: Record<string, string>) => {

    // const filter = query;
    // const searchTerm = query.searchTerm || "";
    // const sort = query.sort || "-createdAt";
    // const fields = query.fields?.split(",")?.join(" ") || "";
    // const page = Number(query.page) || 1;
    // const limit = Number(query.limit) || 10;

    // const skip = (page - 1) * limit


    // for (const field of excludeFields) { // to delete all other value from the query that doesn't need for find
    //     delete filter[field]
    // }

    // const searchQuery = {
    //     $or: tourSearchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
    // }

    /**
     * {
        // title: { $regex: searchTerm, $options: "i" }
        $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
            { location: { $regex: searchTerm, $options: "i" } },
        ]
    }
    */


    // const tours = await Tour
    //     .find(searchQuery) //search
    //     .find(filter)   //filter
    //     .sort(sort)
    //     .select(fields) //field limiting
    //     .skip(skip)
    //     .limit(limit);

    // const totalTours = await Tour.countDocuments();

    // const totalPage = Math.ceil(totalTours / limit)

    const queryBuilder = new QueryBuilder(Tour.find(), query);

    const tours = queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fieldFilter()


    const [data, meta] = await Promise.all([
        tours.build(),
        tours.getMeta()
    ])

    // const meta = {
    // page: page,
    // limit: limit,
    // total: totalTours,
    // totalPage: totalPage
    // }

    return {
        data: data,
        meta: meta
    }
}


const updateTour = async (id: string, payload: Partial<ITour>) => {

    if (payload.tourType) {
        const isTourExistInTourType = await TourType.findById(payload.tourType);

        if (!isTourExistInTourType) {
            throw new AppError(StatusCodes.BAD_REQUEST, "This tour type does not exist.")
        }
    }

    if (payload.division) {
        const isTourExistInDivision = await Division.findById(payload.division);

        if (!isTourExistInDivision) {
            throw new AppError(StatusCodes.BAD_REQUEST, "This division does not exist.")
        }
    }

    const existingTour = await Tour.findById(id);

    if (payload.images && payload.images.length && existingTour && existingTour.images?.length) {
        payload.images = [...payload.images, ...existingTour.images];
    }

    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour?.images && existingTour.images.length > 0) {

        const restDBImages = existingTour.images.filter(image => !payload.deleteImages?.includes(image))

        const updatedPayloadImages = (payload.images || [])
            .filter(image => !payload.deleteImages?.includes(image))
            .filter(image => !restDBImages.includes(image));


        payload.images = [...restDBImages, ...updatedPayloadImages]


    }

    const updatedTourResult = await Tour.findOneAndUpdate({ _id: id }, payload, { new: true, runValidators: true })


    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour?.images && existingTour.images.length > 0) {
        await Promise.all(payload.deleteImages.map(image => deleteImageFromCloudinary(image)));
    }

    if (!updatedTourResult) {
        throw new AppError(StatusCodes.BAD_REQUEST, "This tour does not exists.")
    }

    console.log({ data: updatedTourResult })
    return updatedTourResult
}


export const deleteTour = async (id: string) => {

    const isTourExist = await Tour.findOne({ _id: id });

    if (!isTourExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Tour does not exist.")
    }

    const isTourExistInUser = await User.find({ bookings: id });

    if (isTourExistInUser) {
        throw new AppError(StatusCodes.BAD_REQUEST, "This tour type exists in tour collection. Please handle this first.")
    }

    await Tour.deleteOne({ _id: id })
    return true;
}


export const tourServices = {
    createTourType,
    getTourTypes,
    updateTourTypes,
    deleteTourTypes,

    createTour,
    getTours,
    updateTour,
    deleteTour
}