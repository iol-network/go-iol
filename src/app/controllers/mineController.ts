import BlockChainLib from './../libraries/blockChainLib'
import WalletLib from '../libraries/walletLib';
import TransactionLib from '../libraries/transactionLib';
import MineService from '../services/mineService';
import MinerationLib from './../libraries/minerationLib'
import { MIN_TRANSACTION_TIP } from './../../configs/iol_config'

class MineController {

    async mineBlock(req: any, res: any) {

        try {

            let {
                proof_of_work,
                previous_hash,
                wallet_address,
            } = req.body.previous_hash
                    ? req.body
                    : req.query;

            if (!(wallet_address && wallet_address.length === 64)) {
                res.send({ success: false, error: "INVALID_WHALLET_ADDRESS" });
                return;
            }

            if (await MinerationLib.isProofValid(previous_hash, 4, proof_of_work) !== true) {
                res.send({ success: false, error: "INVALID_PROOF" });
                return;
            }

            let previous_block = await BlockChainLib.getLastBlock();
            let previous_proof = previous_block.proof;

            if (previous_proof != previous_hash) {
                res.send({ success: false, error: `CURRENT_PREVIOUS_HASH IS: ${previous_proof}` });
                return;
            }

            let transactions = await MineService.treatTransitionsToBlock(wallet_address);

            let block: any = await BlockChainLib.createBlock(proof_of_work, previous_hash, transactions)

            res.send({ success: true, metadata: block });
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

export default new MineController();