"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ message: "Name must be string" })
        .min(3, { message: "Division must be at least 3 character long." })
        .max(26, { message: "Division must be up to 26 character." }),
    slug: zod_1.default
        .string({ message: "slug must be string" })
        .min(8, { message: "Division must be at least 8 character long." })
        .optional(),
    thumbnail: zod_1.default
        .url({ protocol: /^https$/ })
        .optional(),
    description: zod_1.default
        .string({ message: "description must be string" })
        .min(25, { message: "Division must be at least 25 character long." })
        .max(2000, { message: "Division must be up to 2000 character." })
        .optional(),
});
exports.updateDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ message: "Name must be string" })
        .min(3, { message: "Division must be at least 3 character long." })
        .max(26, { message: "Division must be up to 26 character." })
        .optional(),
    slug: zod_1.default
        .string({ message: "slug must be string" })
        .min(8, { message: "Division must be at least 8 character long." })
        .optional(),
    thumbnail: zod_1.default
        .url({ protocol: /^https$/ })
        .optional(),
    description: zod_1.default
        .string({ message: "description must be string" })
        .min(25, { message: "Division must be at least 25 character long." })
        .max(2000, { message: "Division must be up to 2000 character." })
        .optional(),
});
