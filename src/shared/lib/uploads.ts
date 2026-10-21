import {
	v2 as cloudinary,
	type UploadApiOptions,
	type UploadApiResponse,
} from "cloudinary";
import { MAX_IMAGE_SIZE, validateImageFile } from "./image-validation";

export type SaveImageResult =
	| { ok: true; url: string }
	| { ok: false; error: string };

type SaveImageOptions = {
	removeBackground?: boolean;
};

const UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "technest";

const ALLOWED_FORMATS = ["png", "jpg", "jpeg", "webp", "gif", "avif", "svg"];

const BACKGROUND_REMOVAL_TYPES = [
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/avif",
];

function getCloudinaryConfig() {
	const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
	const apiKey = process.env.CLOUDINARY_API_KEY;
	const apiSecret = process.env.CLOUDINARY_API_SECRET;

	if (!cloudName || !apiKey || !apiSecret) return null;

	return {
		cloud_name: cloudName,
		api_key: apiKey,
		api_secret: apiSecret,
		secure: true,
	};
}

function uploadBuffer(
	buffer: Buffer,
	removeBackground: boolean,
): Promise<UploadApiResponse> {
	const options: UploadApiOptions = {
		folder: UPLOAD_FOLDER,
		resource_type: "image",
		allowed_formats: ALLOWED_FORMATS,
		max_file_size: MAX_IMAGE_SIZE,
		unique_filename: true,
		overwrite: false,
	};

	if (removeBackground) {
		options.eager = [{ effect: "background_removal", format: "png" }];
	}

	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			options,
			(error, result) => {
				if (error) {
					reject(new Error(error.message));
					return;
				}
				if (!result) {
					reject(new Error("Cloudinary returned no upload result."));
					return;
				}
				resolve(result);
			},
		);

		stream.end(buffer);
	});
}

export async function saveImageFile(
	file: File,
	{ removeBackground = false }: SaveImageOptions = {},
): Promise<SaveImageResult> {
	const validationError = validateImageFile(file);
	if (validationError) return { ok: false, error: validationError };

	if (removeBackground && !BACKGROUND_REMOVAL_TYPES.includes(file.type)) {
		return {
			ok: false,
			error: "Background removal supports PNG, JPG, WEBP, or AVIF images.",
		};
	}

	const config = getCloudinaryConfig();
	if (!config) {
		return { ok: false, error: "Image storage is not configured." };
	}

	cloudinary.config(config);

	try {
		const buffer = Buffer.from(await file.arrayBuffer());
		const result = await uploadBuffer(buffer, removeBackground);

		if (removeBackground) {
			const eager = Array.isArray(result.eager) ? result.eager[0] : null;
			if (!eager?.secure_url) {
				return { ok: false, error: "Could not remove the background." };
			}
			return { ok: true, url: eager.secure_url };
		}

		return { ok: true, url: result.secure_url };
	} catch {
		return { ok: false, error: "Could not store the image." };
	}
}

export async function resolveImageUpload(
	formData: FormData,
	urlField = "imageUrl",
): Promise<SaveImageResult> {
	const file = formData.get("imageFile");

	if (file instanceof File && file.size > 0) {
		const removeBackground = formData.get("removeBackground") === "true";
		return saveImageFile(file, { removeBackground });
	}

	const url = formData.get(urlField);
	return { ok: true, url: typeof url === "string" ? url.trim() : "" };
}
