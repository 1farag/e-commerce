import multer from "multer";
import { InvalidFileFormat, InvalidFileType } from "../utils/errors.js";

const fileValidation = {
	image: ["image/jpeg", "image/png", "image/jpg"],
	video: ["video/mp4", "video/mkv", "video/avi"],
};

function accessFile(fileType) {
	if (!fileValidation[fileType]) {
		throw new InvalidFileType();
	}

	const storage = multer.memoryStorage();

	const fileFilter = (req, file, cb) => {
		if (fileValidation[fileType].includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new InvalidFileFormat(fileType), false);
		}
	};

	const upload = multer({ storage, fileFilter });

	return upload;
}

export default accessFile;
