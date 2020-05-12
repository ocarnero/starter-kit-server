import mongoose from 'mongoose';
import { logger } from './logging';
mongoose.Promise = global.Promise;

export const initDatabase = () => {
	const url = 'mongodb://localhost:27017/graphqldb';
	mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
	mongoose.connection.once('open', () => logger.info(`Connected to mongo at ${url}`));
}
