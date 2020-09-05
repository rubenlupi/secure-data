import * as config from 'config';
import * as mongoose from 'mongoose';

class MongoClient {
    public static CONNECTION_OPTIONS = {
        useCreateIndex: true,
        useNewUrlParser: true,
    };

    public async disconnect() {
        await mongoose.disconnect();
    }

    public async connect() {
        if (mongoose.connection.readyState === 1) {
            console.log('Mongoose already connected');
            return;
        }

        if (config.database == null) {
            return null;
        }

        // @ts-ignore
        mongoose.Promise = Promise;

        await mongoose.connect(config.database, MongoClient.CONNECTION_OPTIONS);
        console.log('Mongoose Connected');
    }
}

const mongoClient = new MongoClient();

export { mongoClient, MongoClient };
