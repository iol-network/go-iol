import { Router } from 'express';
import { check, param } from 'express-validator';
import { checkIsValidPrivateKey } from './../middlewares/blockchainMiddleware'
import { checkParams } from './../middlewares/paramsMiddleware'

import WalletController from './../controllers/walletController'

let router: Router = Router();

router.post('/wallet/create', WalletController.createWallet);

router.get('/wallet/alias-by-public-address',
    [
        check('public_address').isString().withMessage("INVALID_DESCRIPTION")
    ], checkParams,
    WalletController.getAliasByPublicAddress);

router.get('/wallet/public-address-by-alias',
    [
        check('alias').isString().withMessage("INVALID_DESCRIPTION")
    ], checkParams,
    WalletController.getPublicAddressByAlias);

router.get('/wallet/public-address-by-private-key',
    [
        check('private_key').isString().withMessage("INVALID_DESCRIPTION")
    ], checkParams,
    WalletController.getPublicAddressByPrivateKey);

router.get('/wallet/balance',
    [
        // check('private_key').isString().withMessage("INVALID_DESCRIPTION")
    ], checkParams,
    WalletController.getBalanceByWallet);

export default router;