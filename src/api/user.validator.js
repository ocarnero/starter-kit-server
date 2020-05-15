import { UserInputError } from 'apollo-server-express';
import { isEmail } from 'validator';

export const validators = {
    Mutation: {
			addUser: (resolve, obj, args, context) => {
				const { email, password, fullName } = args.addUserReq;
				if (!isEmail(email)) {
						throw new UserInputError('Invalid Email address!');
				}
				if (!passwordSchema.validate(password)) {
						throw new UserInputError('Password is not strong enough!');
				}
				return resolve(obj, args, context);
			},
			editUser: (resolve, obj, args, context) => {
				const { email } = args.editUserReq;
				if (!isEmail(email)) {
						throw new UserInputError('Invalid Email address!');
				}
				return resolve(obj, args, context);
			}
    }
};
