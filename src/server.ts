import * as config from 'config';
import { mongoClient } from './infra/database/mongo-connect';
import { appAPI } from './app';

const startServer = async () => {
    try {
        await mongoClient.connect();
    } catch (err) {
        console.log('MongoDB Connection Failed.');
        console.error(err);
        process.exit(1);
    }

    try {
        appAPI.listen(config.portAPI, () => {
            console.log('Server API is running', config.portAPI);
        });
    } catch (err) {
        console.log('App error', err);
        process.exit(1);
    }
}

startServer();

