import {
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
// Set the AWS region
const s3Client = new S3Client({
	region,
	credentials: {
		accessKeyId,
		secretAccessKey,
	},
});
// Get a signed URL for uploading a file
export const getSignedUrlForUpload = async (req) => {
	const { originalname } = req.file;
	const key = `${uuidv4()}-${originalname}`;
	const params = new PutObjectCommand({
		Bucket: bucketName,
		Body: req.file.buffer,
		Key: key,
		ContentType: req.file.mimetype,
	});

	const result = await s3Client.send(params);
	if (result.$metadata.httpStatusCode !== 200) {
		throw new Error("Failed to upload file");
	}
	return key;
};

// Get a signed URL for downloading a file
export const getSignedUrlForDownload = async (req) => {
	const { key } = req.params;
	const params = {
		Bucket: bucketName,
		Key: key,
		Expires: 60 * 5,
	};
	const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
	return { url, key };
};

// Delete a file
export const deleteFile = async (req) => {
	const { key } = req.params;
	const params = {
		Bucket: bucketName,
		Key: key,
	};
	await s3Client.send(new DeleteObjectCommand(params));
	return { message: "File deleted successfully" };
};

// Get a list of files
export const getFiles = async (req) => {
	const params = {
		Bucket: bucketName,
	};
	const data = await s3Client.send(new ListObjectsCommand(params));
	return data.Contents;
};

// Get a specific file
export const getFile = async (req) => {
	const { key } = req.params;
	const params = {
		Bucket: bucketName,
		Key: key,
	};
	const data = await s3Client.send(new GetObjectCommand(params));
	return data;
};
