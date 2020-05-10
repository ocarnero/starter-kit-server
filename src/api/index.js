import fs from 'fs';
import path from 'path';
import { ForbiddenError } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import { shield } from 'graphql-shield';

const helper = {
	_read: true,
	_typeDefs: [],
	_resolvers: [],
	_permissions: {},
	_validators: {},
}

const _merge = (target, source) => {
	target.Query = target.Query ? target.Query : {};
	source.Query = source.Query ? source.Query : {};
	target.Mutation = target.Mutation ? target.Mutation : {};
	source.Mutation = source.Mutation ? source.Mutation : {};

	const preQuery = target.Query;
	const preMutation = target.Mutation;

	Object.assign(target, source);
	Object.assign(target.Query, preQuery);
	Object.assign(target.Mutation, preMutation);
};

const _scan = async (directory) => {
	const files = fs.readdirSync(directory)
			.filter(file => fs.lstatSync(path.join(directory, file)).isFile())
			.filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js');

	const dirs = fs.readdirSync(directory)
			.filter(file => fs.lstatSync(path.join(directory, file)).isDirectory());

	for (const file of files) {
			const obj = await import(path.join(directory, file));

			if (obj.typeDefs) {
					helper._typeDefs.push(obj.typeDefs);
			}
			if (obj.resolvers) {
					helper._resolvers.push(obj.resolvers);
			}
			if (obj.permissions) {
					_merge(helper._permissions, obj.permissions);
			}
			if (obj.validators) {
					_merge(helper._validators, obj.validators);
			}
	}

	for (const dir of dirs) {
			await _scan(path.join(directory, dir));
	}
};

const getSchema = async () => {
	if (helper._read) {
			await _scan(__dirname);
			helper._read = false;
	}

	// Create graphql schema with middleware
	const schema = makeExecutableSchema({ typeDefs: helper._typeDefs, resolvers: helper._resolvers });

	return applyMiddleware(schema,
			helper._validators,
			shield(helper._permissions, {
					allowExternalErrors: true,
					fallbackError: new ForbiddenError('Not Authorised!')
			}));
};

export const apiExplorer = {
	getSchema
};
