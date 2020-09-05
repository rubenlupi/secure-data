const express = require('express');

import * as bluebird from 'bluebird';
import { appMiddlewares, handleErrors } from './core/app-middlewares';
import { router } from './infra/http/api/routes';

const appAPI = express();

global.Promise = bluebird;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

appMiddlewares(appAPI);
appAPI.use(router);
handleErrors(appAPI);

export { appAPI };