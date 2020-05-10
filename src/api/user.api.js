import { readFileSync } from 'fs';
//import { userService } from '../services/user.service';

export const typeDefs = readFileSync(`${ __dirname }/user.api.graphql`, 'utf8');

export const resolvers = {

    Query: {

        userById: (obj, { id }, context, info) => {
						//return userService.findById(id);
						return {};
        },

        users: (obj, args, context, info) => {
						//return userService.findAll();
						return [];
        }
    },

    Mutation: {

        editUser: (obj, { id, editUserReq }, context, info) => {
						//return userService.editUser(id, editUserReq);
						return {};
        },

        deleteUser: (obj, { id }, context, info) => {
						//return userService.deleteUser(id);
						return true;
        }
    }
};
