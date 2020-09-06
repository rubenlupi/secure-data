import * as express from 'express';
import { Router } from 'express';
import { InitSave } from '../../useCases/save-secure-data';
import { InitGet } from '../../useCases/get-secure-data';

// TODO Not implemented the API feature

const securityTokenV1Router: Router = express.Router();

securityTokenV1Router.post('/',
    (req: unknown, res: unknown, next) => 
    
    InitSave.getInitUseCase().createSecurityTokenApiController.saveSecurityData(
        req, res, next));

securityTokenV1Router.post('/search',
    (req: unknown, res: unknown, next) => 
    InitGet.getInitUseCase().getSecurityDataApiController.getSecurityData(
        req,res, next));        

export { securityTokenV1Router };
