import { Router } from 'express';
import { check, param } from 'express-validator';
import { checkIsValidPrivateKey, serverPrivateRequestKey } from './../middlewares/blockchainMiddleware'
import { checkParams } from './../middlewares/paramsMiddleware'

import NodeController from './../controllers/nodeController'

let router: Router = Router();

router.post('/node/connect',
    [
        check('node_ip').isString().withMessage("INVALID_NODE_IP"),
    ], checkParams,
    NodeController.connectNode);

router.get('/node/list',
    [
        check('last_node'),
    ], checkParams,
    NodeController.listNodes);

router.post('/node/block/new',
    [
        check('signal_ip').isString().withMessage("INVALID_SIGNAL_IP"),
        check('length').isNumeric().withMessage("INVALID_LENGTH"),
    ], checkParams,
    NodeController.newBlockSignal);

export default router;