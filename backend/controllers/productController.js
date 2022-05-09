import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc Fetch All Products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 4;
	const page = Number(req.query.pageNumber) || 1;
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i'
				}
		  }
		: {};
	console.log(page, keyword);
	const count = await Product.count(keyword);
	const products = await Product.find(keyword)
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch Single Products
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) res.json(product);
	else {
		res.status(404);
		throw new Error('Product Not Found');
	}
});

// @desc Delete a Product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		await product.remove();
		res.json({ message: 'Product Removed' });
	} else {
		res.status(404);
		throw new Error('Product Not Found');
	}
});

// @desc Create a Product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: 'Sample Name',
		price: 0,
		user: req.user._id,
		image: '/images/sample.jpg',
		brand: 'Sample Brand',
		category: 'Sample Category',
		countInStock: 0,
		numReviews: 0,
		description: 'Sample Description'
	});
	const createdProduct = await product.save();
	res.status(201).json(createdProduct);
});

// @desc Update a Product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
	const { name, price, image, brand, category, countInStock, description } = req.body;
	const product = await Product.findById(req.params.id);
	if (product) {
		product.name = name || product.name;
		product.price = price || product.price;
		product.image = image || product.image;
		product.brand = brand || product.brand;
		product.category = category || product.category;
		product.countInStock = countInStock || product.countInStock;
		product.description = description || product.description;
		const updatedProduct = await product.save();
		res.status(201).json(updatedProduct);
	} else {
		res.status(404);
		throw new Error('Product Not Found');
	}
});

// @desc Create new Review
// @route PUT /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;
	const product = await Product.findById(req.params.id);
	if (product) {
		const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
		if (alreadyReviewed) {
			res.status(400);
			throw new Error('Already Reviewed');
		}
		console.log(req.user);
		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment: comment,
			user: req.user._id
		};
		product.reviews.push(review);
		product.numReviews = product.reviews.length;
		product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.numReviews;
		await product.save();
		res.status(201).json({ message: 'Review Added' });
	} else {
		res.status(404);
		throw new Error('Product Not Found');
	}
});

// @desc Get top Products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(5);
	res.json(products);
});

export {
	getProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
	createProductReview,
	getTopProducts
};
