import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
	throw new Error('❌ Please add your MongoDB URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {
	maxPoolSize: 10,
	connectTimeoutMS: 60000,
	serverSelectionTimeoutMS: 60000,
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
	const globalWithMongo = global as typeof globalThis & {
		_mongoClientPromise?: Promise<MongoClient>
	}

	if (!globalWithMongo._mongoClientPromise) {
		client = new MongoClient(uri, options)
		globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
			console.error('❌ MongoDB connection error:', err)
			throw err
		})
	}
	clientPromise = globalWithMongo._mongoClientPromise
} else {
	client = new MongoClient(uri, options)
	clientPromise = client.connect().catch((err) => {
		console.error('❌ MongoDB connection error:', err)
		throw err
	})
}

export default clientPromise
