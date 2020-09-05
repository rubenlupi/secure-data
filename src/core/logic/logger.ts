import * as bunyan from 'bunyan';
import * as config from 'config';
import * as bunyanExpress from 'bunyan-express-serializer';
import { elasticStream } from '../../infra/database/elastic';

const streams = [];

export interface IEvent {
    name: string;
    message?: string;
    time?: Date | string;
}

export interface IErrorEvent extends IEvent {
    error: Error;
}

if (process.env.NODE_ENV !== 'test') streams.push({ stream: elasticStream });

if (config.stdOutLogsEnvironments.includes(process.env.NODE_ENV)) {
    streams.push({ stream: process.stdout });
}

const LogOps = {
    ERROR: 'errors',
};

const log = bunyan.createLogger({
    streams,
    name: 'log',
    serializers: {
        err: bunyan.stdSerializers.err,
        req: bunyanExpress,
        res: bunyan.stdSerializers.res
    },
    type: LogOps.ERROR
});
const errorLogInfo = log.child({ type: LogOps.ERROR });


function logger(type: string, event: any) {
    try {
        switch (type) {
            case LogOps.ERROR:
                return errorLogInfo.error(event);
        }
    } catch (err) {
        console.log('Failed to log the event', event);
        console.log('Connection to logs crash due to', err);
    }
}

function errorLog(event: IErrorEvent) {
    return logger(LogOps.ERROR, event);
}

export { errorLog };
