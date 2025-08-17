/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelper/AppError";
import stream from 'stream';

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})


export const deleteImageFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|png|jpeg|gif|webp)$/i;
        const match = url.match(regex);

        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
        }
    } catch (error: any) {
        throw new AppError(401, "Cloudinary image deletion filed.", error.message)
    }
}

export const uploadBufferToCloudinary = (buffer: Buffer, fileName: string) => {
    try {
        return new Promise((resolve, reject) => {

            const public_id = `pdf/${fileName}-${Date.now()}`;

            const bufferStream = new stream.PassThrough();
            bufferStream.end();

            cloudinary.uploader.upload_stream({
                resource_type: "auto",
                public_id: public_id,
                folder: "pdf"
            },
                (error, result) => {
                    if (error) {
                        return reject(error)
                    }
                    resolve(result)
                }
            ).end(buffer)

        })
    } catch (error: any) {
        console.log(error);
        throw new AppError(500, `Error during upload the invoice file ${error.message}`)
    }
}

export const cloudinaryUpload = cloudinary;