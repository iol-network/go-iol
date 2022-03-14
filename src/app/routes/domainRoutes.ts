import { Router } from 'express';
import { check, param } from 'express-validator';
import { checkIsValidPrivateKey, serverPrivateRequestKey } from './../middlewares/blockchainMiddleware'
import { checkParams } from './../middlewares/paramsMiddleware'

import DomainController from './../controllers/domainController'

let router: Router = Router();

router.get('/domain/dns',
    [
        check('domain').isString().withMessage("INVALID_DOMAIN"),
        check('extension').isString().withMessage("INVALID_EXTENSION"),
    ], checkParams,
    DomainController.getDNS);

router.get('/domain/contracts',
    [
        check('domain').isString().withMessage("INVALID_DOMAIN"),
        check('extension').isString().withMessage("INVALID_EXTENSION"),
    ], checkParams,
    DomainController.getDNSContracts);

export default router;