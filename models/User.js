import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		login: {
			type: String,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		avatarUrl: String,
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('User', UserSchema)
