import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var userSchema = new Schema({
	id: mongoose.ObjectId,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date },
	fullName: { type: String, trim: true },
	email: { type: String, required: true, trim: true, index: { unique: true } },
	password: { type: String, required: true, trim: true },
	role: {
		type: String,
		required: true,
		enum: ['ADMIN', 'USER_MANAGER', 'USER',]
	}
}, { collection: 'users' })
	.pre('save', function(next) {
		const now = new Date();
		if (!this.createdAt) this.createdAt = now;
		if (!this.updatedAt) this.updatedAt = now;
		next();
});

// Compile model from schema
const UserModel = mongoose.model('User', userSchema );

export default UserModel;