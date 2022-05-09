import express from 'express';
import multer from 'multer';
import { extname } from 'path';
import { protect, admin } from '../middlewares/authMiddleware.js';
const router = express.Router();

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads/');
	},
	filename(req, file, cb) {
		cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
	}
});
function fileFilter(req, file, cb) {
	const fileTypes = /jpg|jpeg|png/;
	const extFlag = fileTypes.test(extname(file.originalname).toLowerCase());
	const mimeFlag = fileTypes.test(file.mimetype);
	if (extFlag && mimeFlag) {
		return cb(null, true);
	} else {
		cb('Images Only');
	}
}

const upload = multer({ storage, fileFilter });

router.post('/', upload.single('image'), (req, res) => {
	const filePath = req.file.path.replace(`\\`, `/`);
	res.send(`/${filePath}`);
});

export default router;
