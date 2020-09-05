import { Client } from '@elastic/elasticsearch';
import * as config from 'config';
import * as moment from 'moment';
import * as stream from 'stream';

class ElasticWritableStream extends stream.Writable {
    private static BASE_PROTOCOL = 'http';
    private readonly indexPattern: string;
    private client: Client;

    constructor(host: string, indexPattern: string) {
        super();

        if (!host.startsWith(ElasticWritableStream.BASE_PROTOCOL)) {
            host = `${ElasticWritableStream.BASE_PROTOCOL}://${host}`;
        }

        this.client = new Client({ node: host });
        this.indexPattern = indexPattern;
    }

    public async _write(chunk: Buffer, encoding: string, next: (error?: Error) => void) {
        const document = this.getDocument(chunk);

        try {
            await this.client.index(document);
        } catch (err) {
            console.error('Error logging to elastic:', err);
        }

        next();
    }

    public async disconnect() {
        await this.client.close();
    }

    public async checkStatus(): Promise<boolean> {
        try {
            const health = await this.client.cluster.health();

            return health && health.statusCode === 200;
        } catch (err) {
            return false;
        }
    }

    private getDocument(chunk: Buffer) {
        const body = JSON.parse(chunk.toString());
        const id = body.id;

        body['@timestamp'] = body.time ? new Date(body.time) : new Date();
        delete body.time;
        delete body.id;

        if (typeof body.error === 'object') {
            body.error = JSON.stringify(body.error);
        }

        const document: any = {
            body,
            index: this.getIndexFromPattern(this.indexPattern, body.timestamp)
        };

        if (id) {
            document.id = id;
        }

        return document;
    }

    private getIndexFromPattern(indexPattern: string, timestamp) {
        return moment.utc(timestamp).format(indexPattern);
    }
}

let hostUri = `${config.logstash.host}`;

if (config.logstash.port) {
    hostUri += `:${config.logstash.port}`;
}

const elasticStream = new ElasticWritableStream(hostUri, config.logstash.indexPattern);

export { ElasticWritableStream, elasticStream };