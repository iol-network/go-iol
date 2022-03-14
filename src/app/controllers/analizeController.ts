import BlockChainLib from '../libraries/blockChainLib';
import WalletLib from '../libraries/walletLib';

class AnalizeController {

    async analizeBlockchain(req: any, res: any) {

        try {

            let last_block = await BlockChainLib.getLastBlock();
            let is_valid_chain = await BlockChainLib.checkIsValidChain();

            let metadata = {
                length: last_block.index,
                last_block: last_block,
                valid_chain: is_valid_chain,
            }

            res.send({ success: true, metadata: metadata });
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

export default new AnalizeController();