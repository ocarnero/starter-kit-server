import { readFileSync } from 'fs';
import { userService } from '../services/user.service';
import { USER_ROLES } from '../models/enums.model'

export const typeDefs = readFileSync(`${ __dirname }/user.api.graphql`, 'utf8');

export const resolvers = {
    Query: {
        userById: (obj, { id }, context, info) => {
						return userService.findById(id);
        },
        users: (obj, args, context, info) => {
						return userService.findAll();
				},
				roles: (obj, args, context, info) => {
					return USER_ROLES;
				},
    },
    Mutation: {
			addUser: async (obj, { addUserReq }, context, info) => {
				if (await userService.findByEmail(addUserReq.email)) {
						return { success: false, message: 'Email address exists!', user: undefined };
				}
				
				try {
					let user = await userService.createUser(addUserReq);
					if(user) {
						return { success: true, message: 'Success!', user }
					}
					return { success: false, message: "Error ocurred", user: undefined }
				} 
				catch (err) {
						return { success: false, message: err, user: undefined }
				}
				},
        editUser: (obj, { _id, editUserReq }, context, info) => {
						return userService.editUser(_id, editUserReq);
        },
        deleteUser: (obj, { _id }, context, info) => {
						return userService.deleteUser(_id);
        }
    }
};
