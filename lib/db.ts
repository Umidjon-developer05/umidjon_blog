import mongoose from 'mongoose'

let isConnected = false

export const connectToDb = async () => {
	if (isConnected) {
		console.log('MongoDB is already connected')
		return
	}

	try {
		if (!process.env.MONGODB_URI) {
			throw new Error('MONGODB_URI is not defined')
		}

		await mongoose.connect(process.env.MONGODB_URI)

		isConnected = true
		console.log('Connected to MongoDB')
	} catch (error) {
		console.error('Error connecting to MongoDB:', error)
		throw error
	}
}
