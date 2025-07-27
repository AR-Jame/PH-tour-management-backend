import z from "zod";

export const createDivisionZodSchema = z.object({
    name: z
        .string({ message: "Name must be string" })
        .min(3, { message: "Division must be at least 3 character long." })
        .max(26, { message: "Division must be up to 26 character." }),
    slug: z
        .string({ message: "slug must be string" })
        .min(8, { message: "Division must be at least 8 character long." }),
    thumbnail: z
        .url({ protocol: /^https$/ })
        .optional(),
    description: z
        .string({ message: "description must be string" })
        .min(25, { message: "Division must be at least 25 character long." })
        .max(2000, { message: "Division must be up to 2000 character." })
        .optional(),

})
export const updateDivisionZodSchema = z.object({
    name: z
        .string({ message: "Name must be string" })
        .min(3, { message: "Division must be at least 3 character long." })
        .max(26, { message: "Division must be up to 26 character." })
        .optional(),
    slug: z
        .string({ message: "slug must be string" })
        .min(8, { message: "Division must be at least 8 character long." })
        .optional(),
    thumbnail: z
        .url({ protocol: /^https$/ })
        .optional(),
    description: z
        .string({ message: "description must be string" })
        .min(25, { message: "Division must be at least 25 character long." })
        .max(2000, { message: "Division must be up to 2000 character." })
        .optional(),

})