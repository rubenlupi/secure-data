const express = require('express');

import * as bluebird from 'bluebird';
import { appMiddlewares, handleErrors } from './core/app-middlewares';
import { router } from './infra/http/api/routes';
import { setGraphql } from './modules/secure-data/http/graphql';

const appAPI = express();
const appGraphql = express();

global.Promise = bluebird;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

appMiddlewares(appGraphql);
appMiddlewares(appAPI);
appAPI.use(router);
setGraphql(appGraphql);
handleErrors(appGraphql);
handleErrors(appAPI);

export { appGraphql, appAPI };