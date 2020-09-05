import * as express from 'express';
import { securityTokenV1Router } from '../../../modules/secure-data/http/api-rest/v1';

const router = express.Router();

// Versioned REST resources
router.use('/secure-data', securityTokenV1Router);

export { router };
