import { Router } from 'express';
import { check, param } from 'express-validator';
import { checkIsValidPrivateKey } from './../middlewares/blockchainMiddleware'
import { checkParams } from './../middlewares/paramsMiddleware'

import TransactionController from './../controllers/transactionController'

let router: Router = Router();

// Transfer IOL Coin between addresses
router.post('/transaction/coin/transfer',
    [
        check('private_key').custom(wallet_id => checkIsValidPrivateKey(wallet_id)).withMessage("INVALID_PRIVATE_KEY"),
        check('amount').isFloat().withMessage("INVALID_AMOUNT"),
        check('description').isString().withMessage("INVALID_DESCRIPTION"),
        check('tip').isFloat().withMessage("INVALID_tip"),
    ], checkParams,
    TransactionController.addAmountTransfer);

// Create NFT
router.post('/transaction/nft/create',
    [
        check('private_key').custom(wallet_id => checkIsValidPrivateKey(wallet_id)).withMessage("INVALID_PRIVATE_KEY"),
        check('reciver_private_key').custom(wallet_id => checkIsValidPrivateKey(wallet_id)).withMessage("INVALID_PRIVATE_KEY"),
        check('description').isString().withMessage("INVALID_DATA"),
        check('tip').isFloat().withMessage("INVALID_tip"),
    ], checkParams,
    TransactionController.createNFT);

// Transfer NFT
router.post('/transaction/nft/transfer',
    [
        check('private_key').custom(wallet_id => checkIsValidPrivateKey(wallet_id)).withMessage("INVALID_PRIVATE_KEY"),
        check('nft_id').isString().withMessage("INVALID_NFT_ID"),
        check('description').isString().withMessage("INVALID_DESCRIPTION"),
        check('tip').isFloat().withMessage("INVALID_tip"),
    ], checkParams,
    TransactionController.transferNFT);

// Create Domain
router.post('/transaction/domain/create',
    [
        check('private_key').custom(wallet_id => checkIsValidPrivateKey(wallet_id)).withMessage("INVALID_PRIVATE_KEY"),
        check('domain').isString().withMessage("INVALID_DOMAIN"),
        check('extension').isString().withMessage("INVALID_EXTENSION"),
        check('servers').isArray().withMessage("INVALID_SERVERS"),
        check('description').isString().withMessage("INVALID_DESCRIPTION"),
        check('tip').isFloat().withMessage("INVALID_tip"),
    ], checkParams,
    TransactionController.createDomain);

// Update Domain
router.post('/transaction/domain/update',
    [
        check('private_key').custom(wallet_id => checkIsValidPrivateKey(wallet_id)).withMessage("INVALID_PRIVATE_KEY"),
        check('domain').isString().withMessage("INVALID_DOMAIN"),
        check('extension').isString().withMessage("INVALID_EXTENSION"),
        check('servers').isArray().withMessage("INVALID_SERVERS"),
        check('description').isString().withMessage("INVALID_DESCRIPTION"),
        check('tip').isFloat().withMessage("INVALID_tip"),
    ], checkParams,
    TransactionController.updateUpdateDomain);

// Add/Update Alias
router.post('/transaction/alias',
    [
        check('private_key').custom(wallet_id => checkIsValidPrivateKey(wallet_id)).withMessage("INVALID_PRIVATE_KEY"),
        check('alias').isString().withMessage("INVALID_ALIAS"),
        check('tip').isFloat().withMessage("INVALID_tip"),
        check('description').isString().withMessage("INVALID_DESCRIPTION"),
    ], checkParams,
    TransactionController.addAlias);

router.get('/transaction/uid',
    [
        check('transaction_id').isString().withMessage("INVALID_TRANSACTION_ID"),
    ], checkParams,
    TransactionController.getTransitionById);

router.get('/transaction/opened/uid',
    [
        check('transaction_id').isString().withMessage("INVALID_TRANSACTION_ID"),
    ], checkParams,
    TransactionController.getOpenedTransactionById);




export default router;