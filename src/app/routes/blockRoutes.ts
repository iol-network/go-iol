import { Router } from 'express';
import { check, param } from 'express-validator';
import { checkIsValidPrivateKey, serverPrivateRequestKey } from './../middlewares/blockchainMiddleware'
import { checkParams } from './../middlewares/paramsMiddleware'

import BlockController from './../controllers/blockController'

let router: Router = Router();

router.get('/block/get-by-index',
    [
        check('index').isInt().withMessage("INVALID_INT"),
    ], checkParams,
    BlockController.getBlockByIndex);

router.get('/block/list',
    [
        check('last_index'),
        check('sort').isString().withMessage("INVALID_SORT"), // @todo only DESC ou ASC
    ], checkParams,
    BlockController.listBlocks);

export default router;