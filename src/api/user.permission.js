import { isUserManager } from '../utils/shield';

export const permissions = {
    Query: {
        userById: isUserManager,
        users: isUserManager
    },
    Mutation: {
				addUser: isUserManager,
        editUser: isUserManager,
        deleteUser: isUserManager
    }
};
