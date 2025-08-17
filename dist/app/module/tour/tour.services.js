"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourServices = exports.deleteTour = exports.deleteTourTypes = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const tour_model_1 = require("./tour.model");
const division_model_1 = require("../division/division.model");
const user_model_1 = require("../user/user.model");
const tour_constant_1 = require("./tour.constant");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.create(payload);
    return tourType;
});
const getTourTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const tourTypes = yield tour_model_1.TourType.find();
    return tourTypes;
});
const updateTourTypes = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedTourTypes = yield tour_model_1.TourType.findOneAndUpdate({ _id: id }, payload, { new: true, runValidators: true });
    if (!updateTour) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tour type does not exist.");
    }
    return updatedTourTypes;
});
const deleteTourTypes = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypesExist = yield tour_model_1.TourType.findOne({ _id: id });
    if (!isTourTypesExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tour types does not exist.");
    }
    const isTourTypesExistInTour = yield tour_model_1.Tour.find({ tourType: id });
    if (isTourTypesExistInTour) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This tour type exists in tour collection. Please handle this first.");
    }
    yield tour_model_1.TourType.deleteOne({ _id: id });
    return true;
});
exports.deleteTourTypes = deleteTourTypes;
// Tour related services
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourExistInTourType = yield tour_model_1.TourType.findById(payload.tourType);
    if (!isTourExistInTourType) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This tour type does not exist.");
    }
    const isTourExistInDivision = yield division_model_1.Division.findById(payload.division);
    if (!isTourExistInDivision) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This division does not exist.");
    }
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
const getTours = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = queryBuilder
        .search(tour_constant_1.tourSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fieldFilter();
    const [data, meta] = yield Promise.all([
        tours.build(),
        tours.getMeta()
    ]);
    // const meta = {
    // page: page,
    // limit: limit,
    // total: totalTours,
    // totalPage: totalPage
    // }
    return {
        data: data,
        meta: meta
    };
});
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (payload.tourType) {
        const isTourExistInTourType = yield tour_model_1.TourType.findById(payload.tourType);
        if (!isTourExistInTourType) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This tour type does not exist.");
        }
    }
    if (payload.division) {
        const isTourExistInDivision = yield division_model_1.Division.findById(payload.division);
        if (!isTourExistInDivision) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This division does not exist.");
        }
    }
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (payload.images && payload.images.length && existingTour && ((_a = existingTour.images) === null || _a === void 0 ? void 0 : _a.length)) {
        payload.images = [...payload.images, ...existingTour.images];
    }
    if (payload.deleteImages && payload.deleteImages.length > 0 && (existingTour === null || existingTour === void 0 ? void 0 : existingTour.images) && existingTour.images.length > 0) {
        const restDBImages = existingTour.images.filter(image => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(image)); });
        const updatedPayloadImages = (payload.images || [])
            .filter(image => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(image)); })
            .filter(image => !restDBImages.includes(image));
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }
    const updatedTourResult = yield tour_model_1.Tour.findOneAndUpdate({ _id: id }, payload, { new: true, runValidators: true });
    if (payload.deleteImages && payload.deleteImages.length > 0 && (existingTour === null || existingTour === void 0 ? void 0 : existingTour.images) && existingTour.images.length > 0) {
        yield Promise.all(payload.deleteImages.map(image => (0, cloudinary_config_1.deleteImageFromCloudinary)(image)));
    }
    if (!updatedTourResult) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This tour does not exists.");
    }
    console.log({ data: updatedTourResult });
    return updatedTourResult;
});
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourExist = yield tour_model_1.Tour.findOne({ _id: id });
    if (!isTourExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tour does not exist.");
    }
    const isTourExistInUser = yield user_model_1.User.find({ bookings: id });
    if (isTourExistInUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This tour type exists in tour collection. Please handle this first.");
    }
    yield tour_model_1.Tour.deleteOne({ _id: id });
    return true;
});
exports.deleteTour = deleteTour;
exports.tourServices = {
    createTourType,
    getTourTypes,
    updateTourTypes,
    deleteTourTypes: exports.deleteTourTypes,
    createTour,
    getTours,
    updateTour,
    deleteTour: exports.deleteTour
};
