import BlockChainLib from './../libraries/blockChainLib'
import MinerationLib from '../libraries/minerationLib';
import WalletLib from '../libraries/walletLib';
import TransactionLib from '../libraries/transactionLib';
import { IS_MINER, SERVER_WALLET } from './../../configs/server_config'
import NodeService from './nodeService';

class MineService {

    async mineBlock() {

        if (!IS_MINER) {
            return;
        }

        // @Todo Check number of transitions

        let previous_block = await BlockChainLib.getLastBlock();
        let previous_proof = previous_block.proof;

        // @validate transactions
        console.log(await BlockChainLib.getDifficultyLevel());
        let proof = await MinerationLib.proofOfWork(previous_proof, await BlockChainLib.getDifficultyLevel()); // @TODO pegar dinamico
        let previous_hash = await BlockChainLib.getBlockHash(previous_block)

        // @TODO add award transition
        let transactions = await this.treatTransitionsToBlock(SERVER_WALLET);

        let block: any = await BlockChainLib.createBlock(proof, previous_hash, transactions)

        await TransactionLib.clearTransitions();

        await NodeService.propagateNewBlock();

        return {
            length: block.index,
            block: block,
        }

    }

    async treatTransitionsToBlock(wallet: string | null = null) {

        let transactions = await TransactionLib.getTransitions();
        let tips = await TransactionLib.sumTransitionsTips(transactions);

        if (wallet && wallet.length === 64) {

            let chain_length = await BlockChainLib.getBlockChainLength();

            let award = await BlockChainLib.getAwardValue();

            if (award > 0) {
                let award_transaction = await TransactionLib.createAwardTransition(wallet, (award + tips))
                await transactions.push(award_transaction);
            }

        }

        return transactions;

    }

}

export default new MineService();