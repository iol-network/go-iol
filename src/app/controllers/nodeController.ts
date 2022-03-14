import BlockChainLib from '../libraries/blockChainLib';
import NodeLib from '../libraries/nodeLib'
import NodeService from '../services/nodeService';

class NodeController {

    async connectNode(req: any, res: any) {

        try {

            let { node_ip } = req.body.node_ip
                ? req.body
                : req.query;

            let is_new_node = await NodeLib.addNode(node_ip);

            if (is_new_node) {
                NodeService.discoverExternalNodes(node_ip);
            }

            res.send({ success: true });
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

    async listNodes(req: any, res: any) {

        try {

            let { last_node } = req.body.last_node
                ? req.body
                : req.query;

            let response = await NodeLib.listNodes((last_node && last_node.length > 3) ? last_node : null);

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

    async newBlockSignal(req: any, res: any) {

        try {

            let {
                signal_ip,
                length
            } = req.body.signal_ip
                    ? req.body
                    : req.query;

            await NodeService.preccessNewBlock(signal_ip, length);

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

export default new NodeController();