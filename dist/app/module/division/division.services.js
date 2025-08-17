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
exports.divisionServices = exports.deleteDivision = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const division_model_1 = require("./division.model");
const tour_model_1 = require("../tour/tour.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // const isDivisionExist = await Division.findOne({ name: payload.name });
    // if (isDivisionExist) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "Division already exists.")
    // }
    // const slug = `${payload.name}-division`
    // payload.slug = slug
    const division = yield division_model_1.Division.create(payload);
    return division;
});
const getDivision = () => __awaiter(void 0, void 0, void 0, function* () {
    const divisions = yield division_model_1.Division.find();
    const totalDivision = yield division_model_1.Division.countDocuments();
    return {
        data: divisions,
        meta: {
            total: totalDivision
        }
    };
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.findOne({ slug });
    return division;
});
const updateDivision = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isDivisionExist = yield division_model_1.Division.findOne({ _id: id });
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
        const baseSlug = (_a = payload.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;
        let counter = 1;
        while (yield division_model_1.Division.exists({ slug })) {
            slug = `${slug}-${counter++}`;
        }
        payload.slug = slug;
    }
    const updatedDivision = yield division_model_1.Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (payload.thumbnail && (isDivisionExist === null || isDivisionExist === void 0 ? void 0 : isDivisionExist.thumbnail)) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(isDivisionExist.thumbnail);
    }
    if (!updatedDivision) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Division does not exist.");
    }
    return updatedDivision;
});
const deleteDivision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const isDivisionExist = await Division.findOne({ _id: id });
    // if (!isDivisionExist) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "Division does not exist.")
    // }
    const isDivisionExistInTour = yield tour_model_1.Tour.find({ division: id });
    console.log(isDivisionExistInTour);
    // if (isDivisionExistInTour) {
    //     throw new AppError(StatusCodes.BAD_REQUEST, "This division exists in tour collection. Please handle this first.")
    // }
    yield division_model_1.Division.deleteOne({ _id: id });
    return true;
});
exports.deleteDivision = deleteDivision;
exports.divisionServices = {
    createDivision,
    getDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision: exports.deleteDivision,
};
