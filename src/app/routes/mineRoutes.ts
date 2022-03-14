import { Router } from 'express';
import { check, param } from 'express-validator';
import { checkIsValidPrivateKey } from './../middlewares/blockchainMiddleware'
import { checkParams } from './../middlewares/paramsMiddleware'

import MineController from './../controllers/mineController'

let router: Router = Router();

router.post('/mine/block',
    [
        check('previous_hash'), // @TODO
        check('proof_of_work'), // @TODO
        check('wallet_address'), // @TODO
    ], checkParams,
    MineController.mineBlock);

export default router;