import BlockChainLib from '../libraries/blockChainLib';
import WalletLib from '../libraries/walletLib';

class NFTController {

    async getNftData(req: any, res: any) {

        try {

            let { nft_id } = req.body.nft_id
                ? req.body
                : req.query;

            let response = await BlockChainLib.getNFTData(nft_id);

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

    async getNftOwner(req: any, res: any) {

        try {

            let { nft_id } = req.body.nft_id
                ? req.body
                : req.query;

            let response = await BlockChainLib.getNFTOwner(nft_id);

            res.send({
                success: true,
                metadata: {
                    public_address: response
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

    async listNftsByCreator(req: any, res: any) {

        try {

            let { public_address, start_at } = req.body.public_address
                ? req.body
                : req.query;

            let response = await BlockChainLib.listNftsByCreator(public_address, start_at && start_at > 0 ? start_at : 1);

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

export default new NFTController();