import mongoose from 'mongoose';
import { config } from 'dotenv';
import colors from 'colors';

import users from './data/users.js';

import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

import connectDB from './config/db.js';

import products from './data/products.js';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

config();

connectDB();

const importData = async () => {
	try {
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();

		const createdUsers = await User.insertMany(users);
		const adminUser = createdUsers[0]._id;
		const sampleProducts = products.map((product) => {
			return { ...product, user: adminUser };
		});
		await Product.insertMany(sampleProducts);
		console.log(`Data Imported`.green.inverse);
		process.exit();
	} catch (err) {
		console.log(`${err.message}`.red);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();

		console.log(`Data Destroyed`.red.inverse);
		process.exit();
	} catch (err) {
		console.log(`${err.message}`.red);
		process.exit(1);
	}
};

const flag = process.argv[2];
flag === '-d' ? destroyData() : importData();
