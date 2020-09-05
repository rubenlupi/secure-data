import * as express from 'express';
import { Router } from 'express';
import { createSecurityTokenApiController } from '../../useCases/save-secure-data';

// TODO Not implemented the API feature

const securityTokenV1Router: Router = express.Router();

securityTokenV1Router.post('/',
    (req: unknown, res: unknown, next) => createSecurityTokenApiController.saveSecurityToken(
        req, res, next));

export { securityTokenV1Router };
