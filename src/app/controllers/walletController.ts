import BlockChainLib from '../libraries/blockChainLib';
import TransactionLib from '../libraries/transactionLib';
import WalletLib from '../libraries/walletLib';

class WalletController {

    async createWallet(req: any, res: any) {

        try {

            let crypto = require('crypto');

            let keyPair = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'der',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'der',
                }
            });

            let private_key = keyPair.privateKey.toString('base64');
            let public_key = await WalletLib.getPublicKey(private_key);

            res.send({
                success: true,
                metadata: {
                    public_address: public_key,
                    private_key: private_key
                }
            });
            return;

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async getPublicAddressByAlias(req: any, res: any) {

        try {

            let { alias } = req.body.alias
                ? req.body
                : req.query;


            let response = await BlockChainLib.getPublicAddressByAlias(alias);

            res.send({
                success: true,
                metadata: {
                    public_address: response,
                    alias: alias
                }
            });
            return;

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async getAliasByPublicAddress(req: any, res: any) {

        try {

            let { public_address } = req.body.public_address
                ? req.body
                : req.query;

            let response = await BlockChainLib.getAliasByPublicAddress(public_address);

            res.send({
                success: true,
                metadata: {
                    public_address: public_address,
                    alias: response
                }
            });
            return;

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async getPublicAddressByPrivateKey(req: any, res: any) {

        try {

            let { private_key } = req.body.private_key
                ? req.body
                : req.query;

            let public_address = await WalletLib.getPublicKey(private_key);

            res.send({
                success: true,
                metadata: {
                    public_address: public_address,
                    private_key: private_key
                }
            });
            return;

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

    async getBalanceByWallet(req: any, res: any) {

        try {

            let {
                reciver_address,
                reciver_alias
            } = req.body.reciver_address || req.body.reciver_alias
                    ? req.body
                    : req.query;

            let public_key = await BlockChainLib.getReciverPublicKey({
                type: reciver_alias && reciver_alias.length > 2 ? "alias" : "public_address",
                value: reciver_alias && reciver_alias.length > 2 ? reciver_alias : reciver_address
            });

            if (!public_key) {
                res.send({ success: false, error: "INVALID_PUBLIC_KEY " });
                return;
            }

            let balances = await BlockChainLib.getAmountByArrPublicAddresses([public_key]);
            let amount_in_transactions = await TransactionLib.getAmountByArrPublicKeysInTransactions([public_key]);

            res.send({
                success: true,
                metadata: {
                    balance: balances[public_key],
                    opened_transaction_balance: amount_in_transactions[public_key],
                    opened_transactions: await TransactionLib.getTransitions(),
                }
            });
            return;

        } catch (e: any) {

            res.send({
                success: false,
                error: "INTERNAL_ERROR ",
                metadata: {
                    error: e.message,
                }
            });
            return;

        }

    }

}

export default new WalletController();