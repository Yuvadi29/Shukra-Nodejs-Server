import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

import dotenv from "dotenv";
import { bucketName, region, accessKeyId, secretAccessKey } from "./api";

dotenv.config();

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export function uploadFile(fileBuffer, fileName, mimetype) {
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: 'product-images/uploaded-image.jpg',
        ContentType: mimetype,
    };
    console.log("File uploaded");

    return s3Client.send(new PutObjectCommand(uploadParams));
}