import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (fileBuffer) => {
    try {
        if (!fileBuffer) return null;

        return await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "ems_profiles"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(fileBuffer);
        });

    } catch (error) {
        return null;
    }
}

const uploadPdfOnCloudinary = async (fileBuffer, filename = "slip.pdf") => {
    try {
        if (!fileBuffer) return null;

        return await new Promise((resolve, reject) => {
            // using resource_type "raw" allows raw non-image documents to be securely stored.
            // alternatively 'image' with 'format: pdf' works for standard pdf rendering.
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw", 
                    folder: "ems_slips",
                    public_id: filename // provide extension so Cloudinary sets correct mime-type
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(fileBuffer);
        });

    } catch (error) {
        return null;
    }
}

export { uploadOnCloudinary, uploadPdfOnCloudinary }
