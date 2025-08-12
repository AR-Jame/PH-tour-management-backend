import z from "zod";

export const createTourTypeZodSchema = z.object({
    name: z
        .string({ message: "Tour type must be string" })
})
export const updateTourTypeZodSchema = z.object({
    name: z
        .string({ message: "Tour type must be string" })
})


export const createTourZodSchema = z.object({
    title: z
        .string({ message: "Title must be an string" }),
    slug: z
        .string({ message: "Slug must be an string" })
        .optional(),
    description: z
        .string({ message: "description must be an string" })
        .optional(),
    images: z
        .url({ message: "Please provide a valid URL." })
        .optional(),
    location: z
        .string({ message: "location must be an string" })
        .optional(),
    costForm: z
        .number({ message: "cost must be a number." })
        .optional(),
    startDate: z
        .date({ message: "Provide a valid date" })
        .optional(),
    endDate: z
        .date({ message: "Provide a valid date" })
        .optional(),
    included: z
        .array(z.string())
        .optional(),
    excluded: z
        .array(z.string())
        .optional(),
    amenities: z
        .array(z.string())
        .optional(),
    tourPlan: z
        .array(z.string())
        .optional(),
    maxGuest: z
        .number({ message: "maxGuest must be a number." })
        .optional(),
    minAge: z
        .number({ message: "minAge must be a number." })
        .optional(),
    division: z
        .string({ message: "division must be a string." }),
    tourType: z
        .string({ message: "tour type must be a string." }),
})



export const updateTourZodSchema = z.object({
    title: z
        .string({ message: "Title must be an string" })
        .optional(),
    slug: z
        .string({ message: "Slug must be an string" })
        .optional(),
    description: z
        .string({ message: "description must be an string" })
        .optional(),
    images: z
        .url({ message: "Please provide a valid URL." })
        .optional(),
    location: z
        .string({ message: "location must be an string" })
        .optional(),
    costForm: z
        .number({ message: "cost must be a number." })
        .optional(),
    startDate: z
        .date({ message: "Provide a valid date" })
        .optional(),
    endDate: z
        .date({ message: "Provide a valid date" })
        .optional(),
    departureLocation: z.
        string({ message: "departure location must be an string" })
        .optional(),
    arrivalLocation: z.
        string({ message: "arrival location must be an string" })
        .optional(),
    included: z
        .array(z.string())
        .optional(),
    excluded: z
        .array(z.string())
        .optional(),
    amenities: z
        .array(z.string())
        .optional(),
    tourPlan: z
        .array(z.string())
        .optional(),
    maxGuest: z
        .number({ message: "maxGuest must be a number." })
        .optional(),
    minAge: z
        .number({ message: "minAge must be a number." })
        .optional(),
    division: z
        .string({ message: "division must be a string." })
        .optional(),
    tourType: z
        .string({ message: "tour type must be a string." })
        .optional(),
})