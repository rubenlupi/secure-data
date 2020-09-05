import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { APPError } from './logic/errors';
import { CommonErrors } from './logic/CommonErrors';

const appMiddlewares = (app) => {
    app.use(cors());
    app.options('*', cors());
    app.use(bodyParser.json({limit: '10mb'}));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use((req, res, next) => {
        next();
    });
}

const handleErrors = (app) => {
    app.use((error, req, res, next) => {
        if (!error) {
            return next();
        }
        if (error instanceof APPError) {
            return next(error);
        }
        // catch unhandle errors
        res.status(error.code || 500).json(
            new APPError(CommonErrors.INTERNAL_SERVER_ERROR()),
        );
    });
}

export { appMiddlewares, handleErrors };