import { Router } from 'express';
import { check, param } from 'express-validator';
import { checkIsValidPrivateKey, serverPrivateRequestKey } from './../middlewares/blockchainMiddleware'
import { checkParams } from './../middlewares/paramsMiddleware'

import AnalizeController from './../controllers/analizeController'

let router: Router = Router();

router.post('/analize/private/blockchain',
    [
        check('server_request_key').custom(value => serverPrivateRequestKey(value)).withMessage("INVALID_PRIVATE_REQUEST_KEY"),
    ], checkParams,
    AnalizeController.analizeBlockchain);

export default router;