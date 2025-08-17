"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourZodSchema = exports.createTourZodSchema = exports.updateTourTypeZodSchema = exports.createTourTypeZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ message: "Tour type must be string" })
});
exports.updateTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ message: "Tour type must be string" })
});
exports.createTourZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ message: "Title must be an string" }),
    slug: zod_1.default
        .string({ message: "Slug must be an string" })
        .optional(),
    description: zod_1.default
        .string({ message: "description must be an string" })
        .optional(),
    images: zod_1.default
        .url({ message: "Please provide a valid URL." })
        .optional(),
    location: zod_1.default
        .string({ message: "location must be an string" })
        .optional(),
    costForm: zod_1.default
        .number({ message: "cost must be a number." })
        .optional(),
    startDate: zod_1.default
        .date({ message: "Provide a valid date" })
        .optional(),
    endDate: zod_1.default
        .date({ message: "Provide a valid date" })
        .optional(),
    included: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    excluded: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    amenities: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    tourPlan: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    maxGuest: zod_1.default
        .number({ message: "maxGuest must be a number." })
        .optional(),
    minAge: zod_1.default
        .number({ message: "minAge must be a number." })
        .optional(),
    division: zod_1.default
        .string({ message: "division must be a string." }),
    tourType: zod_1.default
        .string({ message: "tour type must be a string." }),
});
exports.updateTourZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ message: "Title must be an string" })
        .optional(),
    slug: zod_1.default
        .string({ message: "Slug must be an string" })
        .optional(),
    description: zod_1.default
        .string({ message: "description must be an string" })
        .optional(),
    images: zod_1.default
        .url({ message: "Please provide a valid URL." })
        .optional(),
    location: zod_1.default
        .string({ message: "location must be an string" })
        .optional(),
    costForm: zod_1.default
        .number({ message: "cost must be a number." })
        .optional(),
    startDate: zod_1.default
        .date({ message: "Provide a valid date" })
        .optional(),
    endDate: zod_1.default
        .date({ message: "Provide a valid date" })
        .optional(),
    departureLocation: zod_1.default.
        string({ message: "departure location must be an string" })
        .optional(),
    arrivalLocation: zod_1.default.
        string({ message: "arrival location must be an string" })
        .optional(),
    included: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    excluded: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    amenities: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    tourPlan: zod_1.default
        .array(zod_1.default.string())
        .optional(),
    maxGuest: zod_1.default
        .number({ message: "maxGuest must be a number." })
        .optional(),
    minAge: zod_1.default
        .number({ message: "minAge must be a number." })
        .optional(),
    division: zod_1.default
        .string({ message: "division must be a string." })
        .optional(),
    tourType: zod_1.default
        .string({ message: "tour type must be a string." })
        .optional(),
    deleteImages: zod_1.default
        .array(zod_1.default.string())
        .optional()
});
