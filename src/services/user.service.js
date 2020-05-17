import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server-express';

const HASH_ROUNDS = 12;

const findById = async (id) => {
	const user = await User.findById(id);
	return user;
};

const findByIds = async (ids) => {
	const records = await User.find().where('_id').in(ids).exec();
	return records;
};

const findAll = async (first, offset) => {
	first = first || 100;
	offset = offset || 0;

	const result = User.find()
    .skip(offset)
		.limit(first)
		.exec();
	result.then((res)=>console.log(res))

	return result;
};

const login = async (email, password) => {
	const user = await findByEmail(email);

	if (!user) {
			return;
	}

	const passMatch = await bcrypt.compare(password, user.password);

	if (!passMatch) {
			return;
	}

	delete user.password;

	return user;
};

const createUser = async (addUserReq) => {
	console.log(addUserReq)
	addUserReq.password = await bcrypt.hash(addUserReq.password, HASH_ROUNDS);
	delete addUserReq.rePassword;

	addUserReq.role = addUserReq.role || 'USER_MANAGER';

	const user = new User(addUserReq);

	await user.save(function(err) {
		if (err) throw new UserInputError(err);
	});
	return user;
};

const editUser = async (id, editUserReq) => {
	if (!editUserReq.fullName) {
			delete editUserReq.fullName;
	}
	if (!editUserReq.email) {
			delete editUserReq.email;
	}

	if (editUserReq.email) {
			const user = await this.findByEmail(editUserReq.email);

			if (user && user.id !== id) {
					throw new UserInputError('Email address exists!');
			}
	}
	return User.findByIdAndUpdate(
		id,
		editUserReq,
		{new: true},
		(err) => {
			if(err) throw new UserInputError(err);
		})
};

const deleteUser = async (id) => {
	const user = await User.findById(id);

	await User.findByIdAndDelete(id, (err) => {
		if(err) throw new UserInputError(err);
	});

	return user;
};

const changePassword = async (id, password, newPassword) => {
	const user = await this.findById(id);

	if (!await bycrypt.compare(password, user.password)) {
			return false;
	}

	newPassword = await bcrypt.hash(newPassword, HASH_ROUNDS);

	await this.editUser(id, {
		password: newPassword
	});

	return true;
};

const findByEmail = async (email) => {
	return User.findOne({ 'email': email });
};

export const userService = {
	findById,
	findByIds,
	findAll,
	login,
	createUser,
	editUser,
	deleteUser,
	changePassword,
	findByEmail
}