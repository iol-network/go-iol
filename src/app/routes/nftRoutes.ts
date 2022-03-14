import { Router } from 'express';
import { check, param } from 'express-validator';
import { checkIsValidPrivateKey, serverPrivateRequestKey } from './../middlewares/blockchainMiddleware'
import { checkParams } from './../middlewares/paramsMiddleware'

import NftController from './../controllers/nftController'

let router: Router = Router();

router.get('/nft/owner',
    [
        check('nft_id').isString().withMessage("INVALID_DOMAIN"),
    ], checkParams,
    NftController.getNftOwner);

router.get('/nft/data',
    [
        check('nft_id').isString().withMessage("INVALID_DOMAIN"),
    ], checkParams,
    NftController.getNftData);

router.get('/nft/list-by-creator',
    [
        check('public_address').isString().withMessage("INVALID_DOMAIN"),
    ], checkParams,
    NftController.listNftsByCreator);

export default router;