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
        editUser: (obj, { id, editUserReq }, context, info) => {
						return userService.editUser(id, editUserReq);
        },
        deleteUser: (obj, { id }, context, info) => {
						return userService.deleteUser(id);
        }
    }
};
