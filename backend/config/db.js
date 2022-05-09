import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		console.log(process.env.MONGO_URI);
		const result = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true
		});
		console.log(`MongoDB Connected ${result.connection.host}`.cyan.underline);
	} catch (e) {
		console.log(`Error: ${e.message}`.red.underline.bold);
		process.exit(1);
	}
};

export default connectDB;
