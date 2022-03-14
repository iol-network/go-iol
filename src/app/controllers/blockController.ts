import BlockChainLib from '../libraries/blockChainLib';
import TransactionLib from '../libraries/transactionLib'

class BlockController {

    async listBlocks(req: any, res: any) {

        try {

            let {
                last_index,
                sort
            } = req.body.sort
                    ? req.body
                    : req.query;

            let response = await BlockChainLib.listBlocks(sort, last_index && last_index > 0 ? last_index : null);
            let last_block = await BlockChainLib.getLastBlock();

            res.send({ success: true, metadata: response, length: last_block.index });
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

    async getBlockByIndex(req: any, res: any) {

        try {

            let {
                index
            } = req.body.index
                    ? req.body
                    : req.query;

            let response = await BlockChainLib.getBlockByField("index", index);

            res.send({ success: true, metadata: response });
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

export default new BlockController();