export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const IMAGE_EXTENSIONS: Record<string, string> = {
	"image/png": ".png",
	"image/jpeg": ".jpg",
	"image/webp": ".webp",
	"image/gif": ".gif",
	"image/avif": ".avif",
	"image/svg+xml": ".svg",
};

export function validateImageFile(
	file: File | null | undefined,
): string | null {
	if (!file || file.size === 0) return "Choose an image to upload.";
	if (file.size > MAX_IMAGE_SIZE) return "Image must be 5MB or smaller.";
	if (!IMAGE_EXTENSIONS[file.type]) return "Unsupported image format.";
	return null;
}
