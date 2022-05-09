import express from 'express';
import {
	getProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
	createProductReview,
	getTopProducts
} from '../controllers/productController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/top').get(getTopProducts);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct);
router.route('/').get(getProducts).post(protect, admin, createProduct);

export default router;
