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
        if (process.env.NODE_ENV !== 'development') {
            res.header('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
            res.setHeader('Content-Security-Policy', "default-src 'self'");
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            // info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
            res.setHeader('X-XSS-Protection', '0')
            // info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
            res.setHeader('Cache-Control', 'max-age=31536000')
            // info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
            res.setHeader('X-Frame-Options', 'deny')
            // info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
            res.setHeader('HTTP-Strict-Transport-Security', 'max-age=10886400')
        }
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