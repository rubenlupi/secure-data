const express = require('express');

import * as bluebird from 'bluebird';
import { appMiddlewares, handleErrors } from './core/app-middlewares';

const appAPI = express();

global.Promise = bluebird;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

appMiddlewares(appAPI);
handleErrors(appAPI);

export { appAPI };