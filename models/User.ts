import mongoose, { Schema, type Document } from 'mongoose'

export interface IUser extends Document {
	name: string
	email: string
	password?: string
	image?: string
	provider: string
	providerAccountId?: string
	createdAt: Date
	lastLogin?: Date
}

const UserSchema = new Schema<IUser>({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
	},
	password: {
		type: String,
		// Only required for credentials provider
	},
	image: {
		type: String,
	},
	provider: {
		type: String,
		required: true,
	},
	providerAccountId: {
		type: String,
		// Store the provider's account ID for better user matching
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	lastLogin: {
		type: Date,
	},
})

// Create a compound index for provider + providerAccountId
UserSchema.index(
	{ provider: 1, providerAccountId: 1 },
	{ unique: true, sparse: true }
)

// Check if the model is already defined to prevent overwriting
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
