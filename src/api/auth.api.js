import { readFileSync } from 'fs';
import { userService } from '../services/user.service';
import { sign } from '../utils/jwt';

export const typeDefs = readFileSync(`${ __dirname }/auth.api.graphql`, 'utf8');

export const resolvers = {
    Query: {
        authUser: (obj, args, { authUser }, info) => {
						return userService.findById(authUser.id);
        }
    },
    Mutation: {
        login: async (obj, { email, password }, context, info) => {
						const user = await userService.login(email, password);

            if (!user) {
                return {
                    success: false, message: 'Invalid authentication credentials!', token: undefined
                };            }

            const token = sign(user);
            return {
                success: true, message: 'Success!', token, user
            };
        },
        signup: async (obj, { signupReq }, context, info) => {
            if (await userService.findByEmail(signupReq.email)) {
                return { success: false, message: 'Email address exists!', user: undefined };
						}
						
						try {
							let user = await userService.createUser(signupReq);

							if(user) {
								return { success: true, message: 'Success!', user }
							}
							return { success: false, message: "Error ocurred", user: undefined }
						} 
						catch (err) {
								return { success: false, message: err, user: undefined }
						}
        },
        updatePersonalInfo: (obj, { fullName }, { authUser }, info) => {
            return userService.editUser(authUser.id, {
                fullName
						});
        },
        changePassword: (obj, { password, newPassword, reNewPassword }, { authUser }, info) => {
						return userService.changePassword(authUser.id, password, newPassword);
        }
    }
};
